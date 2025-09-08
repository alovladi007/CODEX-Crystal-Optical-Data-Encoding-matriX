"""Compression codecs for archival data."""

import lzma
import zstandard as zstd
from typing import Literal, Tuple, Dict, Any


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