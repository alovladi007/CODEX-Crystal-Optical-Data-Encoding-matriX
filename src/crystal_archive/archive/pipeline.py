"""End-to-end encoding and decoding pipeline."""

import numpy as np
from pathlib import Path
from typing import Dict, Any, Tuple, Optional, List
import json
import hashlib

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
        
        encoded_shard = np.concatenate(encoded_blocks) if encoded_blocks else np.array([], dtype=np.uint8)
        encoded_shards.append(encoded_shard)
    
    # Step 5: Interleave
    print("  Interleaving...")
    interleaver = Interleaver(
        span=profile_params["interleave_span"],
        depth=profile_params["interleave_depth"],
        seed=seed
    )
    
    # Concatenate all shards for interleaving
    all_bits = np.concatenate(encoded_shards) if encoded_shards else np.array([], dtype=np.uint8)
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
    shard_bytes = [shard.tobytes() if hasattr(shard, 'tobytes') else bytes(shard) for shard in shards]
    merkle_tree = MerkleTree(shard_bytes)
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
    all_decoded = np.concatenate(decoded_bits) if decoded_bits else np.array([], dtype=np.uint8)
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