"""Channel simulation and damage models."""

import numpy as np
from typing import Tuple, Optional, Dict, Any
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