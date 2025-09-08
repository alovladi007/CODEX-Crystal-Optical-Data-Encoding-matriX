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