"""Voxel mapping between symbols and 5D optical properties."""

import numpy as np
from typing import Tuple, Dict, Any, List
from enum import Enum


class VoxelMode(Enum):
    """Voxel encoding modes."""
    MODE_3BIT = "3bit"
    MODE_5BIT = "5bit"


class VoxelMapper:
    """Maps between bit sequences and voxel optical properties."""
    
    def __init__(self, mode: str = "3bit"):
        """
        Initialize voxel mapper.
        
        Args:
            mode: Encoding mode ("3bit" or "5bit")
        """
        self.mode = mode
        if mode == "3bit":
            self.bits_per_voxel = 3
            self.orientations = 4
            self.retardance_levels = 2
            self.num_symbols = 8
        elif mode == "5bit":
            self.bits_per_voxel = 5
            self.orientations = 8
            self.retardance_levels = 4
            self.num_symbols = 32
        else:
            raise ValueError(f"Unknown mode: {mode}")
        
        self.gray_codes = self._generate_gray_codes()
        self.symbol_table = self._build_symbol_table()
    
    def _generate_gray_codes(self) -> Dict[int, int]:
        """Generate Gray code mappings."""
        if self.mode == "3bit":
            # Gray codes for 3-bit symbols
            return {
                0: 0b000,  # 0° + λ/4
                1: 0b001,  # 45° + λ/4
                2: 0b011,  # 90° + λ/4
                3: 0b010,  # 135° + λ/4
                4: 0b110,  # 0° + 3λ/4
                5: 0b111,  # 45° + 3λ/4
                6: 0b101,  # 90° + 3λ/4
                7: 0b100,  # 135° + 3λ/4
            }
        else:  # 5bit
            # Simplified Gray code for 5-bit (in practice, use proper 2D Gray codes)
            gray = {}
            for i in range(32):
                # Simple binary Gray code
                gray[i] = i ^ (i >> 1)
            return gray
    
    def _build_symbol_table(self) -> Dict[int, Tuple[float, float]]:
        """Build mapping from symbols to (angle, retardance)."""
        table = {}
        
        if self.mode == "3bit":
            angles = [0, 45, 90, 135]  # degrees
            retardances = [0.25, 0.75]  # wavelengths
            
            for symbol in range(8):
                angle_idx = symbol % 4
                retard_idx = symbol // 4
                table[symbol] = (angles[angle_idx], retardances[retard_idx])
        else:  # 5bit
            angles = [i * 22.5 for i in range(8)]  # 0, 22.5, 45, ..., 157.5
            retardances = [0.25, 0.5, 0.75, 1.0]
            
            for symbol in range(32):
                angle_idx = symbol % 8
                retard_idx = symbol // 8
                table[symbol] = (angles[angle_idx], retardances[retard_idx])
        
        return table
    
    def bits_to_symbols(self, bits: np.ndarray) -> np.ndarray:
        """Convert bit array to symbol array."""
        # Pad if necessary
        padding = (self.bits_per_voxel - len(bits) % self.bits_per_voxel) % self.bits_per_voxel
        if padding:
            bits = np.pad(bits, (0, padding))
        
        symbols = []
        for i in range(0, len(bits), self.bits_per_voxel):
            chunk = bits[i:i+self.bits_per_voxel]
            # Convert to integer
            symbol = 0
            for j, bit in enumerate(chunk):
                symbol |= (bit << (self.bits_per_voxel - 1 - j))
            symbols.append(symbol)
        
        return np.array(symbols, dtype=np.uint8)
    
    def symbols_to_bits(self, symbols: np.ndarray) -> np.ndarray:
        """Convert symbol array back to bits."""
        bits = []
        for symbol in symbols:
            # Convert to bits
            for i in range(self.bits_per_voxel):
                bit = (symbol >> (self.bits_per_voxel - 1 - i)) & 1
                bits.append(bit)
        
        return np.array(bits, dtype=np.uint8)
    
    def symbols_to_voxels(self, symbols: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Convert symbols to voxel properties (angles, retardances)."""
        angles = np.zeros(len(symbols), dtype=float)
        retardances = np.zeros(len(symbols), dtype=float)
        
        for i, symbol in enumerate(symbols):
            if symbol in self.symbol_table:
                angles[i], retardances[i] = self.symbol_table[symbol]
            else:
                # Default to first symbol if out of range
                angles[i], retardances[i] = self.symbol_table[0]
        
        return angles, retardances
    
    def voxels_to_symbols(
        self,
        angles: np.ndarray,
        retardances: np.ndarray,
        soft_output: bool = False
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Convert voxel measurements back to symbols.
        
        Args:
            angles: Measured orientation angles (degrees)
            retardances: Measured retardance values (wavelengths)
            soft_output: Return reliability information
            
        Returns:
            (symbols, reliabilities)
        """
        symbols = np.zeros(len(angles), dtype=np.uint8)
        reliabilities = np.ones(len(angles), dtype=float)
        
        for i, (angle, retard) in enumerate(zip(angles, retardances)):
            # Find closest symbol
            best_symbol = 0
            best_distance = float('inf')
            
            for symbol, (ref_angle, ref_retard) in self.symbol_table.items():
                # Angular distance (wrap around)
                angle_diff = min(abs(angle - ref_angle), 
                               abs(angle - ref_angle + 180),
                               abs(angle - ref_angle - 180))
                retard_diff = abs(retard - ref_retard)
                
                # Combined distance
                distance = angle_diff + retard_diff * 100  # Weight retardance more
                
                if distance < best_distance:
                    best_distance = distance
                    best_symbol = symbol
            
            symbols[i] = best_symbol
            
            if soft_output:
                # Simple reliability based on distance
                reliabilities[i] = max(0.1, 1.0 - best_distance / 50.0)
        
        return symbols, reliabilities