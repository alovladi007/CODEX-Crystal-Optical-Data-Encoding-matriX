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