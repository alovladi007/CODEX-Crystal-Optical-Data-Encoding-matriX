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