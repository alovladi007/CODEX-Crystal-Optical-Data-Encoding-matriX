"""Reed-Solomon erasure coding."""

import numpy as np
import reedsolo
from typing import List, Optional


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
    
    def decode(self, encoded_data: bytes, errors_pos: Optional[List[int]] = None) -> Optional[bytes]:
        """
        Decode RS encoded data.
        
        Args:
            encoded_data: Data with RS parity
            errors_pos: Known error positions (erasures)
            
        Returns:
            Decoded data or None if too many errors
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