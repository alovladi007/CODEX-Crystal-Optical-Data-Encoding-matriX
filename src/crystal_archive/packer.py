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