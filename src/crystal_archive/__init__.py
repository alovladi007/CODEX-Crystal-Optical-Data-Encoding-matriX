"""
Crystal Archive - Ultra-durable archival stack for 5D optical crystal media.
"""

from .archive.pipeline import encode_folder, decode_archive
from .archive.manifest import Manifest
from .simulate.channel import DamageModel, ChannelSimulator

__version__ = "1.0.0"
__all__ = ["encode_folder", "decode_archive", "Manifest", "DamageModel", "ChannelSimulator"]