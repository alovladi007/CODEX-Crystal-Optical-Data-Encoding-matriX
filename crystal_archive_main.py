# src/crystal_archive/__init__.py
"""
Crystal Archive - Ultra-durable archival stack for 5D optical crystal media.
"""

from .archive.pipeline import encode_folder, decode_archive
from .archive.manifest import Manifest
from .simulate.channel import DamageModel, ChannelSimulator

__version__ = "1.0.0"
__all__ = ["encode_folder", "decode_archive", "Manifest", "DamageModel", "ChannelSimulator"]


# ===============================================================================
# src/crystal_archive/packer.py
"""Pack and unpack folders to/from binary blobs."""

import os
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Tuple, Any


def sha256(data: bytes) -> str:
    """Compute SHA-256 hash of bytes."""
    return hashlib.sha256(data).hexdigest()


def pack_folder_to_bytes(folder: Path) -> Tuple[bytes, Dict[str, Any]]:
    """
    Pack a folder into a single binary blob with metadata.
    
    Returns:
        (blob, metadata) where metadata contains file information
    """
    if not folder.exists():
        raise ValueError(f"Folder {folder} does not exist")
    
    metadata = {"files": [], "total_size": 0}
    parts = []
    
    # Header magic
    parts.append(b"CRYSTAL\x00")
    
    # Collect all files
    for root, _, files in os.walk(folder):
        for filename in sorted(files):
            filepath = Path(root) / filename
            relative_path = str(filepath.relative_to(folder))
            
            # Read file content
            try:
                data = filepath.read_bytes()
            except Exception as e:
                print(f"Warning: Could not read {filepath}: {e}")
                continue
            
            # Store metadata
            file_info = {
                "path": relative_path,
                "size": len(data),
                "sha256": sha256(data)
            }
            metadata["files"].append(file_info)
            metadata["total_size"] += len(data)
            
            # Pack: FILE marker + path + size + data
            parts.append(b"FILE\x00")
            parts.append(relative_path.encode("utf-8"))
            parts.append(b"\x00")
            parts.append(len(data).to_bytes(8, "big"))
            parts.append(data)
    
    # Combine all parts
    blob = b"".join(parts)
    return blob, metadata


def unpack_bytes_to_folder(blob: bytes, output_dir: Path) -> Dict[str, Any]:
    """
    Unpack a binary blob back to folder structure.
    
    Returns:
        metadata dict with file information
    """
    if not blob.startswith(b"CRYSTAL\x00"):
        raise ValueError("Invalid archive format")
    
    output_dir.mkdir(parents=True, exist_ok=True)
    metadata = {"files": [], "total_size": 0}
    
    pos = 8  # Skip CRYSTAL magic
    while pos < len(blob):
        # Check for FILE marker
        if pos + 5 > len(blob) or blob[pos:pos+5] != b"FILE\x00":
            break
        pos += 5
        
        # Read filename (null-terminated)
        name_end = blob.find(b"\x00", pos)
        if name_end == -1:
            break
        filename = blob[pos:name_end].decode("utf-8")
        pos = name_end + 1
        
        # Read size
        if pos + 8 > len(blob):
            break
        size = int.from_bytes(blob[pos:pos+8], "big")
        pos += 8
        
        # Read data
        if pos + size > len(blob):
            break
        data = blob[pos:pos+size]
        pos += size
        
        # Write file
        output_path = output_dir / filename
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(data)
        
        # Update metadata
        metadata["files"].append({
            "path": filename,
            "size": size,
            "sha256": sha256(data)
        })
        metadata["total_size"] += size
    
    return metadata


# ===============================================================================
# src/crystal_archive/codecs/compression.py
"""Compression codecs for archival data."""

import lzma
import zstandard as zstd
from typing import Literal, Tuple


CompressionType = Literal["zstd", "xz", "none"]


def compress_data(
    data: bytes, 
    codec: CompressionType = "zstd", 
    level: int = 6
) -> Tuple[bytes, Dict[str, Any]]:
    """
    Compress data using specified codec.
    
    Returns:
        (compressed_data, codec_info)
    """
    if codec == "zstd":
        cctx = zstd.ZstdCompressor(level=level)
        compressed = cctx.compress(data)
        info = {"codec": "zstd", "level": level, "version": zstd.ZSTD_VERSION}
    elif codec == "xz":
        compressed = lzma.compress(data, preset=level)
        info = {"codec": "xz", "level": level}
    else:  # none
        compressed = data
        info = {"codec": "none"}
    
    info["original_size"] = len(data)
    info["compressed_size"] = len(compressed)
    info["ratio"] = len(compressed) / len(data) if data else 1.0
    
    return compressed, info


def decompress_data(data: bytes, codec_info: Dict[str, Any]) -> bytes:
    """Decompress data using codec information."""
    codec = codec_info["codec"]
    
    if codec == "zstd":
        dctx = zstd.ZstdDecompressor()
        return dctx.decompress(data)
    elif codec == "xz":
        return lzma.decompress(data)
    else:  # none
        return data


# ===============================================================================
# src/crystal_archive/codecs/hashing.py
"""Integrity checking with SHA-256 and Merkle trees."""

import hashlib
from typing import List, Optional, Dict, Any


class MerkleTree:
    """Simple Merkle tree implementation for data integrity."""
    
    def __init__(self, leaves: List[bytes], fanout: int = 2):
        """
        Build Merkle tree from data leaves.
        
        Args:
            leaves: List of data chunks
            fanout: Number of children per node (usually 2)
        """
        self.leaves = leaves
        self.fanout = fanout
        self.tree = self._build_tree()
        self.root = self.tree[-1][0] if self.tree else b""
    
    def _hash(self, data: bytes) -> bytes:
        """Compute hash of data."""
        return hashlib.sha256(data).digest()
    
    def _build_tree(self) -> List[List[bytes]]:
        """Build the Merkle tree bottom-up."""
        if not self.leaves:
            return []
        
        # Start with hashes of leaves
        current_level = [self._hash(leaf) for leaf in self.leaves]
        tree = [current_level]
        
        # Build up the tree
        while len(current_level) > 1:
            next_level = []
            for i in range(0, len(current_level), self.fanout):
                # Combine up to 'fanout' nodes
                group = current_level[i:i+self.fanout]
                combined = b"".join(group)
                next_level.append(self._hash(combined))
            current_level = next_level
            tree.append(current_level)
        
        return tree
    
    def get_root(self) -> str:
        """Get hex-encoded Merkle root."""
        return self.root.hex()
    
    def get_proof(self, index: int) -> List[str]:
        """
        Get Merkle proof for leaf at given index.
        
        Returns:
            List of hex-encoded hashes forming the proof path
        """
        if index >= len(self.leaves):
            raise ValueError(f"Index {index} out of range")
        
        proof = []
        current_index = index
        
        for level in self.tree[:-1]:  # Exclude root level
            # Find siblings needed for proof
            group_index = current_index // self.fanout
            group_start = group_index * self.fanout
            
            for i in range(group_start, min(group_start + self.fanout, len(level))):
                if i != current_index:
                    proof.append(level[i].hex())
            
            current_index = group_index
        
        return proof
    
    def verify_proof(self, leaf: bytes, index: int, proof: List[str]) -> bool:
        """Verify a Merkle proof."""
        current_hash = self._hash(leaf)
        current_index = index
        proof_index = 0
        
        for level_num in range(len(self.tree) - 1):
            group_index = current_index // self.fanout
            group_start = group_index * self.fanout
            position_in_group = current_index % self.fanout
            
            # Reconstruct group hash
            group_hashes = []
            for i in range(self.fanout):
                if group_start + i >= len(self.tree[level_num]):
                    break
                if i == position_in_group:
                    group_hashes.append(current_hash)
                else:
                    if proof_index >= len(proof):
                        return False
                    group_hashes.append(bytes.fromhex(proof[proof_index]))
                    proof_index += 1
            
            current_hash = self._hash(b"".join(group_hashes))
            current_index = group_index
        
        return current_hash == self.root


# ===============================================================================
# src/crystal_archive/codecs/ecc_ldpc.py
"""LDPC (Low-Density Parity-Check) error correction codes."""

import numpy as np
from typing import Tuple, Optional


class SimpleLDPC:
    """
    Simplified LDPC encoder/decoder for demonstration.
    In production, use a proper LDPC library like pyldpc or turbofec.
    """
    
    def __init__(self, n: int = 1024, k: int = 768, rate: float = 0.75):
        """
        Initialize LDPC codec.
        
        Args:
            n: Codeword length
            k: Information bits
            rate: Code rate (k/n)
        """
        self.n = n
        self.k = k
        self.rate = rate
        self.m = n - k  # Parity bits
        
        # Generate a simple regular LDPC parity check matrix
        # In practice, use optimized matrices from standards (DVB-S2, CCSDS, etc.)
        self.H = self._generate_parity_matrix()
        self.G = self._generate_generator_matrix()
    
    def _generate_parity_matrix(self) -> np.ndarray:
        """Generate a simple regular LDPC parity check matrix."""
        # Create a sparse matrix with regular column and row weights
        # This is a placeholder - real LDPC uses carefully designed matrices
        H = np.zeros((self.m, self.n), dtype=np.uint8)
        
        # Simple regular construction (not optimal, just for demo)
        col_weight = 3
        row_weight = self.n * col_weight // self.m
        
        # Fill with a regular pattern
        for i in range(self.n):
            # Place 'col_weight' ones in column i
            indices = np.random.choice(self.m, col_weight, replace=False)
            H[indices, i] = 1
        
        return H
    
    def _generate_generator_matrix(self) -> np.ndarray:
        """Generate generator matrix from parity check matrix."""
        # Simplified - in practice use systematic form
        # G such that H @ G.T = 0 (mod 2)
        # For demo, use simple systematic form [I | P]
        G = np.eye(self.k, dtype=np.uint8)
        P = np.random.randint(0, 2, (self.k, self.m), dtype=np.uint8)
        return np.hstack([G, P])
    
    def encode(self, data_bits: np.ndarray) -> np.ndarray:
        """
        Encode information bits into codeword.
        
        Args:
            data_bits: Array of k information bits
            
        Returns:
            Array of n codeword bits
        """
        if len(data_bits) != self.k:
            raise ValueError(f"Expected {self.k} bits, got {len(data_bits)}")
        
        # Simple systematic encoding
        codeword = np.zeros(self.n, dtype=np.uint8)
        codeword[:self.k] = data_bits
        
        # Compute parity bits (simplified)
        # In practice, use efficient encoding algorithms
        parity = np.zeros(self.m, dtype=np.uint8)
        for i in range(self.m):
            # Each parity bit is XOR of certain data bits
            parity[i] = np.sum(data_bits * self.H[i, :self.k]) % 2
        
        codeword[self.k:] = parity
        return codeword
    
    def decode_hard(self, received: np.ndarray, max_iter: int = 50) -> Tuple[np.ndarray, bool]:
        """
        Hard-decision bit-flipping decoder.
        
        Args:
            received: Received codeword (possibly with errors)
            max_iter: Maximum iterations
            
        Returns:
            (decoded_bits, success)
        """
        codeword = received.copy()
        
        for iteration in range(max_iter):
            # Compute syndrome
            syndrome = (self.H @ codeword) % 2
            
            # Check if syndrome is zero (no errors)
            if np.sum(syndrome) == 0:
                return codeword[:self.k], True
            
            # Count unsatisfied checks for each bit
            unsatisfied = np.zeros(self.n, dtype=int)
            for i in range(self.n):
                # Count how many parity checks this bit fails
                unsatisfied[i] = np.sum(self.H[:, i] * syndrome)
            
            # Flip bit with most unsatisfied checks
            flip_idx = np.argmax(unsatisfied)
            if unsatisfied[flip_idx] > 0:
                codeword[flip_idx] ^= 1
        
        return codeword[:self.k], False
    
    def decode_soft(
        self, 
        llr: np.ndarray, 
        max_iter: int = 50,
        min_sum: bool = True
    ) -> Tuple[np.ndarray, np.ndarray, bool]:
        """
        Soft-decision belief propagation decoder.
        
        Args:
            llr: Log-likelihood ratios for each bit
            max_iter: Maximum iterations
            min_sum: Use min-sum approximation
            
        Returns:
            (decoded_bits, posterior_llr, success)
        """
        # Simplified BP decoder
        # Initialize messages
        L = llr.copy()
        
        for iteration in range(max_iter):
            # Variable to check messages
            for check_node in range(self.m):
                connected_vars = np.where(self.H[check_node, :] == 1)[0]
                
                for var in connected_vars:
                    # Compute message from other connected variables
                    others = connected_vars[connected_vars != var]
                    if min_sum:
                        # Min-sum approximation
                        prod_sign = np.prod(np.sign(L[others]))
                        min_mag = np.min(np.abs(L[others])) if len(others) > 0 else 0
                        message = prod_sign * min_mag * 0.75  # Scaling factor
                    else:
                        # Sum-product (tanh rule)
                        tanh_prod = np.prod(np.tanh(L[others] / 2))
                        message = 2 * np.arctanh(np.clip(tanh_prod, -0.9999, 0.9999))
                    
                    # Update LLR
                    L[var] = llr[var] + message
            
            # Make hard decision
            decisions = (L < 0).astype(np.uint8)
            
            # Check syndrome
            syndrome = (self.H @ decisions) % 2
            if np.sum(syndrome) == 0:
                return decisions[:self.k], L, True
        
        return decisions[:self.k], L, False


# ===============================================================================
# src/crystal_archive/codecs/ecc_rs.py
"""Reed-Solomon erasure coding."""

import numpy as np
import reedsolo


class ReedSolomonCodec:
    """Reed-Solomon codec wrapper for erasure coding."""
    
    def __init__(self, n: int = 255, k: int = 223):
        """
        Initialize RS codec.
        
        Args:
            n: Total symbols (data + parity)
            k: Data symbols
        """
        self.n = n
        self.k = k
        self.nsym = n - k  # Number of parity symbols
        self.rs = reedsolo.RSCodec(self.nsym)
    
    def encode(self, data: bytes) -> bytes:
        """Add RS parity symbols to data."""
        # Split data into chunks if needed
        chunks = []
        chunk_size = self.k
        
        for i in range(0, len(data), chunk_size):
            chunk = data[i:i+chunk_size]
            # Pad if necessary
            if len(chunk) < chunk_size:
                chunk = chunk + b'\x00' * (chunk_size - len(chunk))
            
            # Encode chunk
            encoded = self.rs.encode(chunk)
            chunks.append(encoded)
        
        return b''.join(chunks)
    
    def decode(self, encoded_data: bytes, errors_pos: Optional[List[int]] = None) -> bytes:
        """
        Decode RS encoded data.
        
        Args:
            encoded_data: Data with RS parity
            errors_pos: Known error positions (erasures)
            
        Returns:
            Decoded data
        """
        chunks = []
        chunk_size = self.n
        
        for i in range(0, len(encoded_data), chunk_size):
            chunk = encoded_data[i:i+chunk_size]
            
            try:
                if errors_pos:
                    # Erasure decoding (if positions known)
                    decoded, _, _ = self.rs.decode(chunk, erase_pos=errors_pos)
                else:
                    # Error correction (positions unknown)
                    decoded, _, _ = self.rs.decode(chunk)
                chunks.append(decoded)
            except reedsolo.ReedSolomonError:
                # Too many errors to correct
                return None
        
        return b''.join(chunks)
    
    def create_shards(self, data: bytes, shard_size: int = 1024) -> List[bytes]:
        """
        Split data into shards with RS parity.
        
        Args:
            data: Input data
            shard_size: Size of each data shard
            
        Returns:
            List of shards (data + parity)
        """
        # Calculate number of data shards
        num_data_shards = (len(data) + shard_size - 1) // shard_size
        num_parity_shards = int(num_data_shards * (self.n / self.k - 1))
        
        shards = []
        
        # Create data shards
        for i in range(num_data_shards):
            start = i * shard_size
            end = min(start + shard_size, len(data))
            shard = data[start:end]
            
            # Pad last shard if needed
            if len(shard) < shard_size:
                shard = shard + b'\x00' * (shard_size - len(shard))
            
            shards.append(shard)
        
        # Create parity shards (simplified XOR for demo)
        # In practice, use proper RS or fountain codes
        for i in range(num_parity_shards):
            parity = bytearray(shard_size)
            for j, shard in enumerate(shards[:num_data_shards]):
                # Simple XOR parity (replace with proper RS)
                for k in range(shard_size):
                    parity[k] ^= shard[k]
            shards.append(bytes(parity))
        
        return shards


# ===============================================================================
# src/crystal_archive/codecs/interleave.py
"""Interleaving for burst error protection."""

import numpy as np
from typing import Tuple


class Interleaver:
    """Block and convolutional interleaving."""
    
    def __init__(self, span: int = 10000, depth: int = 16, seed: int = 42):
        """
        Initialize interleaver.
        
        Args:
            span: Interleaving span (symbols)
            depth: Interleaving depth (for convolutional)
            seed: Random seed for permutation
        """
        self.span = span
        self.depth = depth
        self.seed = seed
        self.rng = np.random.default_rng(seed)
    
    def block_interleave(self, data: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Block interleaving with pseudo-random permutation.
        
        Returns:
            (interleaved_data, permutation_indices)
        """
        # Generate permutation
        perm = self.rng.permutation(len(data))
        interleaved = data[perm]
        return interleaved, perm
    
    def block_deinterleave(self, data: np.ndarray, perm: np.ndarray) -> np.ndarray:
        """Reverse block interleaving."""
        # Inverse permutation
        inv_perm = np.empty_like(perm)
        inv_perm[perm] = np.arange(len(perm))
        return data[inv_perm]
    
    def convolutional_interleave(self, data: np.ndarray) -> np.ndarray:
        """
        Convolutional interleaving for continuous streams.
        
        Each row is delayed by row_index * delay_unit samples.
        """
        n = len(data)
        rows = self.depth
        cols = (n + rows - 1) // rows
        
        # Pad data to fit matrix
        padded_size = rows * cols
        padded = np.zeros(padded_size, dtype=data.dtype)
        padded[:n] = data
        
        # Reshape into matrix
        matrix = padded.reshape(rows, cols)
        
        # Apply delays
        interleaved = []
        for i in range(rows):
            delay = i * (cols // rows)
            row = np.roll(matrix[i], delay)
            interleaved.append(row)
        
        # Flatten back
        result = np.concatenate(interleaved)
        return result[:n]  # Remove padding
    
    def convolutional_deinterleave(self, data: np.ndarray) -> np.ndarray:
        """Reverse convolutional interleaving."""
        n = len(data)
        rows = self.depth
        cols = (n + rows - 1) // rows
        
        # Pad and reshape
        padded_size = rows * cols
        padded = np.zeros(padded_size, dtype=data.dtype)
        padded[:n] = data
        
        # Split into rows
        interleaved = padded.reshape(-1, rows).T
        
        # Reverse delays
        deinterleaved = []
        for i in range(rows):
            delay = -i * (cols // rows)
            row = np.roll(interleaved[i], delay)
            deinterleaved.append(row)
        
        # Flatten
        matrix = np.array(deinterleaved)
        result = matrix.T.flatten()
        return result[:n]


# ===============================================================================
# src/crystal_archive/mapping/voxel_map.py
"""5D voxel mapping with orientation and retardance encoding."""

import numpy as np
from typing import Tuple, Dict, Any, Literal


VoxelMode = Literal["3bit", "5bit"]


class VoxelMapper:
    """Map binary data to/from 5D voxel symbols."""
    
    # Gray code tables for robust encoding
    GRAY_3BIT = [0b000, 0b001, 0b011, 0b010, 0b110, 0b111, 0b101, 0b100]
    GRAY_2BIT = [0b00, 0b01, 0b11, 0b10]
    
    def __init__(self, mode: VoxelMode = "3bit"):
        """
        Initialize voxel mapper.
        
        Args:
            mode: "3bit" (4 orientations × 2 levels) or "5bit" (8 × 4)
        """
        self.mode = mode
        
        if mode == "3bit":
            self.bits_per_voxel = 3
            self.orientations = 4  # 0°, 45°, 90°, 135°
            self.retardance_levels = 2
            self.orientation_angles = np.array([0, 45, 90, 135], dtype=float)
            self.retardance_values = np.array([0.25, 0.75], dtype=float)  # λ/4, 3λ/4
        else:  # 5bit
            self.bits_per_voxel = 5
            self.orientations = 8  # Every 22.5°
            self.retardance_levels = 4
            self.orientation_angles = np.arange(0, 180, 22.5)
            self.retardance_values = np.array([0.25, 0.5, 0.75, 1.0], dtype=float)
        
        self._build_lookup_tables()
    
    def _build_lookup_tables(self):
        """Build encoding/decoding lookup tables."""
        self.symbol_to_voxel = {}
        self.voxel_to_symbol = {}
        
        if self.mode == "3bit":
            # 3 bits: 2 for orientation (Gray), 1 for retardance
            for symbol in range(8):
                # Extract bit fields
                orient_bits = (symbol >> 1) & 0b11
                retard_bit = symbol & 0b1
                
                # Map to physical values using Gray code
                orient_idx = self.GRAY_2BIT.index(orient_bits) if orient_bits in self.GRAY_2BIT else 0
                retard_idx = retard_bit
                
                angle = self.orientation_angles[orient_idx % len(self.orientation_angles)]
                retardance = self.retardance_values[retard_idx]
                
                self.symbol_to_voxel[symbol] = (angle, retardance)
                self.voxel_to_symbol[(orient_idx, retard_idx)] = symbol
        
        else:  # 5bit
            # 5 bits: 3 for orientation (Gray), 2 for retardance (Gray)
            for symbol in range(32):
                orient_bits = (symbol >> 2) & 0b111
                retard_bits = symbol & 0b11
                
                # Gray decode
                orient_idx = self.GRAY_3BIT.index(orient_bits) if orient_bits in self.GRAY_3BIT else 0
                retard_idx = self.GRAY_2BIT.index(retard_bits) if retard_bits in self.GRAY_2BIT else 0
                
                angle = self.orientation_angles[orient_idx % len(self.orientation_angles)]
                retardance = self.retardance_values[retard_idx % len(self.retardance_values)]
                
                self.symbol_to_voxel[symbol] = (angle, retardance)
                self.voxel_to_symbol[(orient_idx, retard_idx)] = symbol
    
    def bits_to_symbols(self, bits: np.ndarray) -> np.ndarray:
        """Convert bit array to symbol array."""
        # Pad to multiple of bits_per_voxel
        pad_len = (-len(bits)) % self.bits_per_voxel
        if pad_len:
            bits = np.concatenate([bits, np.zeros(pad_len, dtype=bits.dtype)])
        
        # Group bits into symbols
        n_symbols = len(bits) // self.bits_per_voxel
        symbols = np.zeros(n_symbols, dtype=np.uint8)
        
        for i in range(n_symbols):
            start = i * self.bits_per_voxel
            symbol = 0
            for j in range(self.bits_per_voxel):
                if bits[start + j]:
                    symbol |= (1 << (self.bits_per_voxel - 1 - j))
            symbols[i] = symbol
        
        return symbols
    
    def symbols_to_bits(self, symbols: np.ndarray) -> np.ndarray:
        """Convert symbol array back to bits."""
        bits = []
        
        for symbol in symbols:
            for j in range(self.bits_per_voxel):
                bit = (symbol >> (self.bits_per_voxel - 1 - j)) & 1
                bits.append(bit)
        
        return np.array(bits, dtype=np.uint8)
    
    def symbols_to_voxels(self, symbols: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Map symbols to physical voxel parameters.
        
        Returns:
            (angles, retardances) arrays
        """
        angles = np.zeros(len(symbols), dtype=float)
        retardances = np.zeros(len(symbols), dtype=float)
        
        for i, symbol in enumerate(symbols):
            angle, retardance = self.symbol_to_voxel.get(symbol, (0, 0.25))
            angles[i] = angle
            retardances[i] = retardance
        
        return angles, retardances
    
    def voxels_to_symbols(
        self, 
        angles: np.ndarray, 
        retardances: np.ndarray,
        soft_output: bool = False
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Decode physical voxel measurements to symbols.
        
        Args:
            angles: Measured orientation angles
            retardances: Measured retardance values
            soft_output: Return reliability values
            
        Returns:
            (symbols, reliabilities)
        """
        symbols = np.zeros(len(angles), dtype=np.uint8)
        reliabilities = np.ones(len(angles), dtype=float)
        
        for i in range(len(angles)):
            # Find closest orientation
            angle_diffs = np.abs(self.orientation_angles - angles[i] % 180)
            orient_idx = np.argmin(angle_diffs)
            angle_reliability = 1.0 / (1.0 + angle_diffs[orient_idx])
            
            # Find closest retardance
            retard_diffs = np.abs(self.retardance_values - retardances[i])
            retard_idx = np.argmin(retard_diffs)
            retard_reliability = 1.0 / (1.0 + retard_diffs[retard_idx])
            
            # Look up symbol
            symbol = self.voxel_to_symbol.get((orient_idx, retard_idx), 0)
            symbols[i] = symbol
            
            if soft_output:
                reliabilities[i] = min(angle_reliability, retard_reliability)
        
        return symbols, reliabilities