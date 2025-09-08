# src/crystal_archive/archive/manifest.py
"""Self-describing manifest for crystal archives."""

import json
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path


class Manifest:
    """OAIS-compliant manifest with decoding instructions."""
    
    VERSION = "1.0.0"
    
    def __init__(self):
        """Initialize empty manifest."""
        self.data = {
            "version": self.VERSION,
            "created": datetime.utcnow().isoformat(),
            "profile": None,
            "encoding": {},
            "integrity": {},
            "files": [],
            "instructions": self._get_instructions()
        }
    
    def _get_instructions(self) -> str:
        """Get human-readable decoding instructions."""
        return """
Crystal Archive Decoding Instructions
======================================

1. Optical Calibration
   - Use primer targets for focus lock
   - Calibrate polarization angle to 0°
   - Set gain using referee pages

2. Symbol Decoding
   - Read voxel orientation (angle) and retardance
   - Use Gray code tables in manifest
   - Apply soft-decision thresholds if available

3. Error Correction
   - Deinterleave using seed from manifest
   - Apply LDPC soft-decision decoding
   - Use Reed-Solomon for erasure recovery

4. Data Recovery
   - Verify Merkle root
   - Decompress using specified codec
   - Verify file SHA-256 hashes

See full specification in docs/SPEC.md
"""
    
    def set_profile(self, profile: str, params: Dict[str, Any]):
        """Set encoding profile."""
        self.data["profile"] = profile
        self.data["encoding"]["profile_params"] = params
    
    def set_compression(self, codec: str, info: Dict[str, Any]):
        """Set compression codec information."""
        self.data["encoding"]["compression"] = {
            "codec": codec,
            "info": info
        }
    
    def set_ecc_params(self, ldpc_params: Dict, rs_params: Dict):
        """Set error correction parameters."""
        self.data["encoding"]["ecc"] = {
            "ldpc": ldpc_params,
            "reed_solomon": rs_params
        }
    
    def set_voxel_mapping(self, mode: str, params: Dict[str, Any]):
        """Set voxel mapping parameters."""
        self.data["encoding"]["voxel"] = {
            "mode": mode,
            "bits_per_voxel": params.get("bits_per_voxel"),
            "orientations": params.get("orientations"),
            "retardance_levels": params.get("retardance_levels"),
            "gray_codes": params.get("gray_codes", {})
        }
    
    def set_interleaving(self, seed: int, span: int, depth: int):
        """Set interleaving parameters."""
        self.data["encoding"]["interleaving"] = {
            "seed": seed,
            "span": span,
            "depth": depth
        }
    
    def set_geometry(self, tiles_x: int, tiles_y: int, planes: int):
        """Set crystal geometry."""
        self.data["geometry"] = {
            "tiles_x": tiles_x,
            "tiles_y": tiles_y,
            "planes": planes,
            "total_tiles": tiles_x * tiles_y * planes
        }
    
    def add_file(self, path: str, size: int, sha256: str):
        """Add file metadata."""
        self.data["files"].append({
            "path": path,
            "size": size,
            "sha256": sha256
        })
    
    def set_merkle_root(self, root: str):
        """Set Merkle tree root."""
        self.data["integrity"]["merkle_root"] = root
    
    def set_signature(self, public_key: str, signature: str):
        """Set digital signature."""
        self.data["integrity"]["signature"] = {
            "algorithm": "Ed25519",
            "public_key": public_key,
            "signature": signature
        }
    
    def compute_hash(self) -> str:
        """Compute SHA-256 hash of manifest."""
        # Hash without the hash field itself
        data_copy = self.data.copy()
        data_copy.pop("integrity", None)
        json_str = json.dumps(data_copy, sort_keys=True)
        return hashlib.sha256(json_str.encode()).hexdigest()
    
    def save(self, path: Path):
        """Save manifest to JSON file."""
        # Add self-hash
        self.data["integrity"]["manifest_hash"] = self.compute_hash()
        
        with open(path, "w") as f:
            json.dump(self.data, f, indent=2)
    
    @classmethod
    def load(cls, path: Path) -> "Manifest":
        """Load manifest from JSON file."""
        with open(path) as f:
            data = json.load(f)
        
        manifest = cls()
        manifest.data = data
        
        # Verify manifest hash
        stored_hash = data.get("integrity", {}).get("manifest_hash")
        if stored_hash:
            computed_hash = manifest.compute_hash()
            if stored_hash != computed_hash:
                raise ValueError("Manifest integrity check failed")
        
        return manifest


# ===============================================================================
# src/crystal_archive/archive/pipeline.py
"""End-to-end encoding and decoding pipeline."""

import numpy as np
from pathlib import Path
from typing import Dict, Any, Tuple, Optional, List
import json

from ..packer import pack_folder_to_bytes, unpack_bytes_to_folder
from ..codecs.compression import compress_data, decompress_data
from ..codecs.hashing import MerkleTree
from ..codecs.ecc_ldpc import SimpleLDPC
from ..codecs.ecc_rs import ReedSolomonCodec
from ..codecs.interleave import Interleaver
from ..mapping.voxel_map import VoxelMapper
from .manifest import Manifest


# Encoding profiles
PROFILE_A = {
    "name": "Conservative",
    "voxel_mode": "3bit",
    "ldpc_rate": 0.75,
    "rs_overhead": 0.20,
    "interleave_span": 10000,
    "interleave_depth": 16,
    "compression": "zstd",
    "compression_level": 6
}

PROFILE_B = {
    "name": "Aggressive",
    "voxel_mode": "5bit",
    "ldpc_rate": 0.83,
    "rs_overhead": 0.12,
    "interleave_span": 5000,
    "interleave_depth": 8,
    "compression": "zstd",
    "compression_level": 9
}


def encode_folder(
    folder: Path,
    output_dir: Path,
    profile: str = "A",
    seed: int = 42,
    sign: bool = False
) -> Tuple[Path, Manifest]:
    """
    Encode a folder into crystal archive format.
    
    Args:
        folder: Source folder to archive
        output_dir: Output directory for voxel data
        profile: Encoding profile ("A" or "B")
        seed: Random seed for interleaving
        sign: Whether to sign the archive
        
    Returns:
        (output_path, manifest)
    """
    # Select profile
    profile_params = PROFILE_A if profile == "A" else PROFILE_B
    
    # Create output directory
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Encoding {folder} with profile {profile}...")
    
    # Step 1: Pack folder
    print("  Packing files...")
    blob, file_metadata = pack_folder_to_bytes(Path(folder))
    
    # Step 2: Compress
    print("  Compressing...")
    compressed, codec_info = compress_data(
        blob, 
        codec=profile_params["compression"],
        level=profile_params["compression_level"]
    )
    
    # Step 3: Create shards with Reed-Solomon
    print("  Creating error correction shards...")
    rs_codec = ReedSolomonCodec()
    shards = rs_codec.create_shards(compressed, shard_size=4096)
    
    # Step 4: Apply LDPC to each shard
    print("  Applying LDPC encoding...")
    ldpc = SimpleLDPC(n=1024, k=int(1024 * profile_params["ldpc_rate"]))
    encoded_shards = []
    
    for shard in shards:
        # Convert to bits
        shard_bits = np.unpackbits(np.frombuffer(shard, dtype=np.uint8))
        
        # Encode in blocks
        encoded_blocks = []
        for i in range(0, len(shard_bits), ldpc.k):
            block = shard_bits[i:i+ldpc.k]
            if len(block) < ldpc.k:
                block = np.pad(block, (0, ldpc.k - len(block)))
            encoded = ldpc.encode(block)
            encoded_blocks.append(encoded)
        
        encoded_shard = np.concatenate(encoded_blocks)
        encoded_shards.append(encoded_shard)
    
    # Step 5: Interleave
    print("  Interleaving...")
    interleaver = Interleaver(
        span=profile_params["interleave_span"],
        depth=profile_params["interleave_depth"],
        seed=seed
    )
    
    # Concatenate all shards for interleaving
    all_bits = np.concatenate(encoded_shards)
    interleaved, perm_indices = interleaver.block_interleave(all_bits)
    
    # Step 6: Map to voxels
    print("  Mapping to voxels...")
    voxel_mapper = VoxelMapper(mode=profile_params["voxel_mode"])
    symbols = voxel_mapper.bits_to_symbols(interleaved)
    angles, retardances = voxel_mapper.symbols_to_voxels(symbols)
    
    # Step 7: Organize into tiles and planes
    print("  Organizing into tiles...")
    tile_size = 256  # symbols per tile
    n_tiles = (len(symbols) + tile_size - 1) // tile_size
    tiles_per_plane = 64
    n_planes = (n_tiles + tiles_per_plane - 1) // tiles_per_plane
    
    # Save voxel data
    voxel_dir = output_dir / "voxels"
    voxel_dir.mkdir(exist_ok=True)
    
    for plane_idx in range(n_planes):
        plane_dir = voxel_dir / f"plane_{plane_idx:03d}"
        plane_dir.mkdir(exist_ok=True)
        
        for tile_idx in range(tiles_per_plane):
            global_tile_idx = plane_idx * tiles_per_plane + tile_idx
            if global_tile_idx >= n_tiles:
                break
            
            start = global_tile_idx * tile_size
            end = min(start + tile_size, len(symbols))
            
            tile_data = {
                "symbols": symbols[start:end].tolist(),
                "angles": angles[start:end].tolist(),
                "retardances": retardances[start:end].tolist()
            }
            
            tile_path = plane_dir / f"tile_{tile_idx:04d}.json"
            with open(tile_path, "w") as f:
                json.dump(tile_data, f)
    
    # Step 8: Create manifest
    print("  Creating manifest...")
    manifest = Manifest()
    manifest.set_profile(profile, profile_params)
    manifest.set_compression(profile_params["compression"], codec_info)
    manifest.set_ecc_params(
        {"n": ldpc.n, "k": ldpc.k, "rate": ldpc.rate},
        {"n": rs_codec.n, "k": rs_codec.k, "overhead": profile_params["rs_overhead"]}
    )
    manifest.set_voxel_mapping(profile_params["voxel_mode"], {
        "bits_per_voxel": voxel_mapper.bits_per_voxel,
        "orientations": voxel_mapper.orientations,
        "retardance_levels": voxel_mapper.retardance_levels
    })
    manifest.set_interleaving(seed, profile_params["interleave_span"], profile_params["interleave_depth"])
    manifest.set_geometry(8, 8, n_planes)
    
    # Add file metadata
    for file_info in file_metadata["files"]:
        manifest.add_file(file_info["path"], file_info["size"], file_info["sha256"])
    
    # Create Merkle tree
    merkle_tree = MerkleTree([shard for shard in shards])
    manifest.set_merkle_root(merkle_tree.get_root())
    
    # Save manifest
    manifest_path = output_dir / "manifest.json"
    manifest.save(manifest_path)
    
    print(f"Encoding complete. Output: {output_dir}")
    return output_dir, manifest


def decode_archive(
    voxel_dir: Path,
    output_dir: Path,
    soft_decision: bool = True
) -> Path:
    """
    Decode crystal archive back to files.
    
    Args:
        voxel_dir: Directory containing voxel data and manifest
        output_dir: Output directory for recovered files
        soft_decision: Use soft-decision decoding
        
    Returns:
        Path to recovered files
    """
    voxel_dir = Path(voxel_dir)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Decoding archive from {voxel_dir}...")
    
    # Load manifest
    manifest_path = voxel_dir / "manifest.json"
    manifest = Manifest.load(manifest_path)
    
    # Get encoding parameters
    profile_params = manifest.data["encoding"]["profile_params"]
    ldpc_params = manifest.data["encoding"]["ecc"]["ldpc"]
    voxel_mode = manifest.data["encoding"]["voxel"]["mode"]
    interleave_params = manifest.data["encoding"]["interleaving"]
    
    # Step 1: Read voxel data
    print("  Reading voxel data...")
    all_symbols = []
    all_angles = []
    all_retardances = []
    
    voxels_path = voxel_dir / "voxels"
    for plane_dir in sorted(voxels_path.glob("plane_*")):
        for tile_path in sorted(plane_dir.glob("tile_*.json")):
            with open(tile_path) as f:
                tile_data = json.load(f)
            all_symbols.extend(tile_data["symbols"])
            all_angles.extend(tile_data["angles"])
            all_retardances.extend(tile_data["retardances"])
    
    symbols = np.array(all_symbols, dtype=np.uint8)
    angles = np.array(all_angles, dtype=float)
    retardances = np.array(all_retardances, dtype=float)
    
    # Step 2: Demap voxels to bits
    print("  Demapping voxels...")
    voxel_mapper = VoxelMapper(mode=voxel_mode)
    
    # For demonstration, use stored symbols directly
    # In practice, would decode from angles/retardances with calibration
    bits_interleaved = voxel_mapper.symbols_to_bits(symbols)
    
    # Step 3: Deinterleave
    print("  Deinterleaving...")
    interleaver = Interleaver(
        span=interleave_params["span"],
        depth=interleave_params["depth"],
        seed=interleave_params["seed"]
    )
    
    # Generate same permutation
    rng = np.random.default_rng(interleave_params["seed"])
    perm = rng.permutation(len(bits_interleaved))
    bits_encoded = interleaver.block_deinterleave(bits_interleaved, perm)
    
    # Step 4: LDPC decode
    print("  LDPC decoding...")
    ldpc = SimpleLDPC(n=ldpc_params["n"], k=ldpc_params["k"])
    
    decoded_bits = []
    block_size = ldpc.n
    
    for i in range(0, len(bits_encoded), block_size):
        block = bits_encoded[i:i+block_size]
        if len(block) < block_size:
            block = np.pad(block, (0, block_size - len(block)))
        
        # Decode (hard decision for simplicity)
        decoded, success = ldpc.decode_hard(block)
        decoded_bits.append(decoded)
    
    # Convert back to bytes
    all_decoded = np.concatenate(decoded_bits)
    decoded_bytes = np.packbits(all_decoded).tobytes()
    
    # Step 5: Reed-Solomon decode
    print("  Reed-Solomon decoding...")
    rs_codec = ReedSolomonCodec()
    recovered = rs_codec.decode(decoded_bytes)
    
    if recovered is None:
        raise ValueError("Reed-Solomon decoding failed - too many errors")
    
    # Step 6: Decompress
    print("  Decompressing...")
    codec_info = manifest.data["encoding"]["compression"]["info"]
    decompressed = decompress_data(recovered, codec_info)
    
    # Step 7: Unpack files
    print("  Unpacking files...")
    file_metadata = unpack_bytes_to_folder(decompressed, output_dir)
    
    # Verify file hashes
    print("  Verifying integrity...")
    for file_info in manifest.data["files"]:
        file_path = output_dir / file_info["path"]
        if file_path.exists():
            actual_hash = hashlib.sha256(file_path.read_bytes()).hexdigest()
            if actual_hash != file_info["sha256"]:
                print(f"    Warning: Hash mismatch for {file_info['path']}")
    
    print(f"Decoding complete. Files recovered to: {output_dir}")
    return output_dir


# ===============================================================================
# src/crystal_archive/simulate/channel.py
"""Channel simulation and damage models."""

import numpy as np
from typing import Tuple, Optional
from enum import Enum


class DamageType(Enum):
    """Types of damage that can occur."""
    BITFLIP = "bitflip"
    TILE_LOSS = "tile_loss"
    PLANE_ERASURE = "plane_erasure"
    CALIBRATION_DRIFT = "calibration_drift"
    GAUSSIAN_NOISE = "gaussian_noise"


class DamageModel:
    """Model for various types of damage."""
    
    def __init__(self, seed: int = 42):
        """Initialize damage model."""
        self.rng = np.random.default_rng(seed)
    
    def apply_bitflips(self, data: np.ndarray, p: float) -> np.ndarray:
        """Apply random bit flips with probability p."""
        flips = self.rng.random(len(data)) < p
        damaged = data.copy()
        damaged[flips] ^= 1
        return damaged
    
    def apply_tile_loss(
        self, 
        data: np.ndarray, 
        tile_size: int,
        loss_fraction: float
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Apply tile losses (complete corruption of tiles).
        
        Returns:
            (damaged_data, erasure_mask)
        """
        n_tiles = (len(data) + tile_size - 1) // tile_size
        n_lost = int(n_tiles * loss_fraction)
        
        # Select tiles to lose
        lost_tiles = self.rng.choice(n_tiles, n_lost, replace=False)
        
        damaged = data.copy()
        erasure_mask = np.ones(len(data), dtype=bool)
        
        for tile_idx in lost_tiles:
            start = tile_idx * tile_size
            end = min(start + tile_size, len(data))
            # Corrupt with random data
            damaged[start:end] = self.rng.integers(0, 2, end - start, dtype=data.dtype)
            erasure_mask[start:end] = False
        
        return damaged, erasure_mask
    
    def apply_calibration_drift(
        self,
        angles: np.ndarray,
        retardances: np.ndarray,
        angle_drift: float = 3.0,
        gain_drift: float = 0.1
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Apply calibration drift to voxel measurements.
        
        Args:
            angles: Orientation angles
            retardances: Retardance values
            angle_drift: Systematic angle offset in degrees
            gain_drift: Multiplicative gain error (fraction)
            
        Returns:
            (drifted_angles, drifted_retardances)
        """
        # Add systematic angle bias
        drifted_angles = angles + angle_drift
        
        # Apply gain drift to retardances
        gain = 1.0 + self.rng.normal(0, gain_drift)
        drifted_retardances = retardances * gain
        
        return drifted_angles, drifted_retardances
    
    def apply_gaussian_noise(
        self,
        angles: np.ndarray,
        retardances: np.ndarray,
        angle_sigma: float = 2.0,
        retardance_sigma: float = 0.05
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Add Gaussian noise to voxel measurements.
        
        Args:
            angles: Orientation angles
            retardances: Retardance values  
            angle_sigma: Standard deviation for angle noise (degrees)
            retardance_sigma: Standard deviation for retardance noise
            
        Returns:
            (noisy_angles, noisy_retardances)
        """
        angle_noise = self.rng.normal(0, angle_sigma, len(angles))
        retardance_noise = self.rng.normal(0, retardance_sigma, len(retardances))
        
        noisy_angles = angles + angle_noise
        noisy_retardances = np.clip(retardances + retardance_noise, 0, 1)
        
        return noisy_angles, noisy_retardances


class ChannelSimulator:
    """Simulate complete channel with multiple damage types."""
    
    def __init__(self, seed: int = 42):
        """Initialize channel simulator."""
        self.damage_model = DamageModel(seed)
    
    def simulate(
        self,
        data: np.ndarray,
        tile_loss: float = 0.0,
        bitflip_p: float = 0.0,
        angle_drift: float = 0.0,
        angle_noise: float = 0.0
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Apply multiple damage types to data.
        
        Returns:
            (damaged_data, damage_stats)
        """
        damaged = data.copy()
        stats = {}
        
        # Apply tile losses first
        if tile_loss > 0:
            damaged, erasure_mask = self.damage_model.apply_tile_loss(
                damaged, tile_size=256, loss_fraction=tile_loss
            )
            stats["tiles_lost"] = np.sum(~erasure_mask) // 256
        
        # Apply random bit flips
        if bitflip_p > 0:
            damaged = self.damage_model.apply_bitflips(damaged, bitflip_p)
            stats["expected_bitflips"] = int(len(data) * bitflip_p)
        
        stats["angle_drift"] = angle_drift
        stats["angle_noise_sigma"] = angle_noise
        
        return damaged, stats