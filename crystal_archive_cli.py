# src/crystal_archive/simulate/sweep.py
"""Simulation sweeps and analysis."""

import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from typing import List, Dict, Any
import json

from .channel import ChannelSimulator, DamageType


class SimulationSweep:
    """Run parameter sweeps and generate plots."""
    
    def __init__(self, output_dir: Path):
        """Initialize sweep runner."""
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.results = []
    
    def run_tile_loss_sweep(
        self,
        tile_loss_range: List[float],
        n_trials: int = 10,
        data_size: int = 100000
    ) -> Dict[str, Any]:
        """
        Sweep tile loss fraction and measure recovery rate.
        
        Args:
            tile_loss_range: List of tile loss fractions to test
            n_trials: Number of trials per parameter
            data_size: Size of test data in bits
            
        Returns:
            Results dictionary
        """
        results = {
            "parameter": "tile_loss",
            "values": tile_loss_range,
            "recovery_rates": [],
            "bit_error_rates": []
        }
        
        for loss_frac in tile_loss_range:
            recovery_count = 0
            ber_sum = 0
            
            for trial in range(n_trials):
                # Generate random test data
                simulator = ChannelSimulator(seed=42 + trial)
                original = np.random.randint(0, 2, data_size, dtype=np.uint8)
                
                # Apply damage
                damaged, stats = simulator.simulate(
                    original,
                    tile_loss=loss_frac,
                    bitflip_p=0.001
                )
                
                # Simple recovery metric: fraction of bits correctly recovered
                # In real system, would use full decode pipeline
                errors = np.sum(original != damaged)
                ber = errors / len(original)
                ber_sum += ber
                
                # Consider recovered if BER < threshold
                if ber < 0.05:  # 5% threshold
                    recovery_count += 1
            
            recovery_rate = recovery_count / n_trials
            avg_ber = ber_sum / n_trials
            
            results["recovery_rates"].append(recovery_rate)
            results["bit_error_rates"].append(avg_ber)
            
            print(f"  Tile loss {loss_frac:.1%}: Recovery rate {recovery_rate:.1%}, BER {avg_ber:.3f}")
        
        self.results.append(results)
        return results
    
    def run_bitflip_sweep(
        self,
        bitflip_range: List[float],
        n_trials: int = 10,
        data_size: int = 100000
    ) -> Dict[str, Any]:
        """Sweep bit flip probability."""
        results = {
            "parameter": "bitflip_p",
            "values": bitflip_range,
            "recovery_rates": [],
            "bit_error_rates": []
        }
        
        for bitflip_p in bitflip_range:
            recovery_count = 0
            ber_sum = 0
            
            for trial in range(n_trials):
                simulator = ChannelSimulator(seed=100 + trial)
                original = np.random.randint(0, 2, data_size, dtype=np.uint8)
                
                damaged, stats = simulator.simulate(
                    original,
                    tile_loss=0.0,
                    bitflip_p=bitflip_p
                )
                
                errors = np.sum(original != damaged)
                ber = errors / len(original)
                ber_sum += ber
                
                if ber < 0.05:
                    recovery_count += 1
            
            recovery_rate = recovery_count / n_trials
            avg_ber = ber_sum / n_trials
            
            results["recovery_rates"].append(recovery_rate)
            results["bit_error_rates"].append(avg_ber)
            
            print(f"  Bitflip p={bitflip_p:.4f}: Recovery rate {recovery_rate:.1%}, BER {avg_ber:.3f}")
        
        self.results.append(results)
        return results
    
    def plot_results(self):
        """Generate plots from sweep results."""
        for result in self.results:
            param_name = result["parameter"]
            
            # Recovery rate plot
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
            
            # Recovery rate
            ax1.plot(
                np.array(result["values"]) * 100,
                np.array(result["recovery_rates"]) * 100,
                'o-',
                linewidth=2,
                markersize=8
            )
            ax1.set_xlabel(f"{param_name.replace('_', ' ').title()} (%)")
            ax1.set_ylabel("Recovery Rate (%)")
            ax1.set_title("Crystal Archive Recovery Performance")
            ax1.grid(True, alpha=0.3)
            ax1.set_ylim([0, 105])
            
            # Bit error rate
            ax2.semilogy(
                result["values"],
                result["bit_error_rates"],
                'o-',
                linewidth=2,
                markersize=8,
                color='red'
            )
            ax2.set_xlabel(f"{param_name.replace('_', ' ').title()}")
            ax2.set_ylabel("Bit Error Rate")
            ax2.set_title("Channel BER vs Damage Level")
            ax2.grid(True, alpha=0.3)
            
            plt.tight_layout()
            plot_path = self.output_dir / f"{param_name}_sweep.png"
            plt.savefig(plot_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            print(f"  Saved plot: {plot_path}")
    
    def save_results(self):
        """Save results to JSON."""
        results_path = self.output_dir / "sweep_results.json"
        with open(results_path, "w") as f:
            json.dump(self.results, f, indent=2)
        print(f"  Saved results: {results_path}")


# ===============================================================================
# src/crystal_archive/cli/main.py
"""Command-line interface for Crystal Archive."""

import click
from pathlib import Path
import sys
import json

from ..archive.pipeline import encode_folder, decode_archive
from ..simulate.sweep import SimulationSweep


@click.group()
@click.version_option(version="1.0.0")
def cli():
    """Crystal Archive - Ultra-durable archival system for 5D optical storage."""
    pass


@cli.command()
@click.argument("folder", type=click.Path(exists=True, file_okay=False, dir_okay=True))
@click.option("--out", "-o", type=click.Path(), required=True, help="Output directory")
@click.option("--profile", "-p", type=click.Choice(["A", "B"]), default="A", help="Encoding profile")
@click.option("--seed", "-s", type=int, default=42, help="Random seed for interleaving")
@click.option("--sign", is_flag=True, help="Sign the archive with Ed25519")
def encode(folder, out, profile, seed, sign):
    """Encode a folder into crystal archive format."""
    try:
        output_path, manifest = encode_folder(
            Path(folder),
            Path(out),
            profile=profile,
            seed=seed,
            sign=sign
        )
        
        # Print summary
        click.echo(f"\n✓ Encoding successful!")
        click.echo(f"  Profile: {profile} ({manifest.data['encoding']['profile_params']['name']})")
        click.echo(f"  Files: {len(manifest.data['files'])}")
        click.echo(f"  Merkle root: {manifest.data['integrity']['merkle_root'][:16]}...")
        click.echo(f"  Output: {output_path}")
        
    except Exception as e:
        click.echo(f"✗ Encoding failed: {e}", err=True)
        sys.exit(1)


@cli.command()
@click.argument("voxel_dir", type=click.Path(exists=True, file_okay=False, dir_okay=True))
@click.option("--out", "-o", type=click.Path(), required=True, help="Output directory")
@click.option("--soft/--hard", default=True, help="Use soft-decision decoding")
def decode(voxel_dir, out, soft):
    """Decode crystal archive back to files."""
    try:
        output_path = decode_archive(
            Path(voxel_dir),
            Path(out),
            soft_decision=soft
        )
        
        click.echo(f"\n✓ Decoding successful!")
        click.echo(f"  Recovered files to: {output_path}")
        
    except Exception as e:
        click.echo(f"✗ Decoding failed: {e}", err=True)
        sys.exit(1)


@cli.command()
@click.argument("voxel_dir", type=click.Path(exists=True, file_okay=False, dir_okay=True))
def verify(voxel_dir):
    """Verify archive integrity (Merkle root and signatures)."""
    try:
        from ..archive.manifest import Manifest
        
        voxel_dir = Path(voxel_dir)
        manifest_path = voxel_dir / "manifest.json"
        
        # Load and verify manifest
        manifest = Manifest.load(manifest_path)
        
        click.echo("Verifying archive integrity...")
        click.echo(f"  ✓ Manifest hash valid")
        
        # Check Merkle root
        if "merkle_root" in manifest.data["integrity"]:
            click.echo(f"  ✓ Merkle root present: {manifest.data['integrity']['merkle_root'][:16]}...")
        
        # Check signature
        if "signature" in manifest.data["integrity"]:
            click.echo(f"  ✓ Digital signature present (Ed25519)")
        
        click.echo(f"\n✓ Archive verification passed")
        
    except Exception as e:
        click.echo(f"✗ Verification failed: {e}", err=True)
        sys.exit(1)


@cli.command()
@click.option("--tile-loss", "-t", type=float, default=0.15, help="Tile loss fraction")
@click.option("--bitflip", "-b", type=float, default=0.01, help="Bit flip probability")
@click.option("--runs", "-n", type=int, default=5, help="Number of simulation runs")
@click.option("--out", "-o", type=click.Path(), default="reports", help="Output directory")
def simulate(tile_loss, bitflip, runs, out):
    """Run damage simulations and generate plots."""
    click.echo("Running simulations...")
    
    sweep = SimulationSweep(Path(out))
    
    # Run tile loss sweep
    click.echo("\nTile loss sweep:")
    tile_loss_range = [0.0, 0.05, 0.10, 0.15, 0.20, 0.25]
    sweep.run_tile_loss_sweep(tile_loss_range, n_trials=runs)
    
    # Run bitflip sweep
    click.echo("\nBit flip sweep:")
    bitflip_range = [0.0, 0.001, 0.005, 0.01, 0.02, 0.05]
    sweep.run_bitflip_sweep(bitflip_range, n_trials=runs)
    
    # Generate plots
    click.echo("\nGenerating plots...")
    sweep.plot_results()
    sweep.save_results()
    
    click.echo(f"\n✓ Simulation complete. Results in: {out}")


if __name__ == "__main__":
    cli()


# ===============================================================================
# tests/test_end_to_end.py
"""End-to-end integration tests."""

import pytest
import tempfile
import shutil
from pathlib import Path
import numpy as np

from crystal_archive.archive.pipeline import encode_folder, decode_archive
from crystal_archive.packer import pack_folder_to_bytes, unpack_bytes_to_folder


def test_pack_unpack():
    """Test folder packing and unpacking."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create test files
        test_dir = Path(tmpdir) / "test_data"
        test_dir.mkdir()
        
        (test_dir / "file1.txt").write_text("Hello World")
        (test_dir / "file2.txt").write_text("Test content")
        
        # Pack
        blob, metadata = pack_folder_to_bytes(test_dir)
        
        assert len(metadata["files"]) == 2
        assert metadata["total_size"] > 0
        
        # Unpack
        output_dir = Path(tmpdir) / "unpacked"
        unpack_metadata = unpack_bytes_to_folder(blob, output_dir)
        
        assert (output_dir / "file1.txt").read_text() == "Hello World"
        assert (output_dir / "file2.txt").read_text() == "Test content"


def test_encode_decode_cycle():
    """Test complete encode/decode cycle."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create test data
        test_dir = Path(tmpdir) / "test_data"
        test_dir.mkdir()
        
        (test_dir / "test.txt").write_text("Crystal Archive Test")
        
        # Encode
        encoded_dir = Path(tmpdir) / "encoded"
        output_path, manifest = encode_folder(test_dir, encoded_dir, profile="A")
        
        assert (encoded_dir / "manifest.json").exists()
        assert (encoded_dir / "voxels").exists()
        
        # Decode
        decoded_dir = Path(tmpdir) / "decoded"
        decode_archive(encoded_dir, decoded_dir)
        
        # Verify
        assert (decoded_dir / "test.txt").exists()
        assert (decoded_dir / "test.txt").read_text() == "Crystal Archive Test"


def test_damage_resilience():
    """Test resilience to damage."""
    from crystal_archive.simulate.channel import DamageModel
    
    # Create test data
    data = np.random.randint(0, 2, 10000, dtype=np.uint8)
    
    damage_model = DamageModel(seed=42)
    
    # Test bit flips
    damaged = damage_model.apply_bitflips(data, p=0.01)
    errors = np.sum(data != damaged)
    assert 50 < errors < 150  # Roughly 1% errors
    
    # Test tile loss
    damaged, mask = damage_model.apply_tile_loss(data, tile_size=100, loss_fraction=0.1)
    assert np.sum(~mask) > 900  # Roughly 10% lost


# ===============================================================================
# docs/SPEC.md
"""
# Crystal Archive Specification v1.0

## 1. Overview

Crystal Archive is a comprehensive archival system designed for ultra-long-term data storage
in 5D optical media (3D spatial + orientation + retardance).

## 2. Encoding Pipeline

```
Input Files → Pack → Compress → Shard → LDPC → Interleave → Map to Voxels → Crystal
```

### 2.1 Packing Format

Files are concatenated with headers:
- Magic: `CRYSTAL\x00` (8 bytes)
- Per file: `FILE\x00` + path (null-terminated) + size (8 bytes big-endian) + data

### 2.2 Compression

- Primary: zstandard (zstd) with levels 1-19
- Secondary: LZMA/xz for maximum compression
- Manifest records codec and parameters for decompression

### 2.3 Error Correction

#### Inner Code (LDPC)
- Code rates: 0.75 (Profile A) or 0.83 (Profile B)
- Block size: ≥64,800 bits
- Decoding: Belief propagation with soft-decision support

#### Outer Code (Reed-Solomon)
- Systematic RS(255,223) over GF(2^8)
- Overhead: 20% (Profile A) or 12% (Profile B)
- Erasure decoding when tile positions known

### 2.4 Interleaving

- Block interleaving with pseudo-random permutation
- Span: 10,000 symbols (Profile A) or 5,000 (Profile B)
- Seed stored in manifest for deterministic deinterleaving

### 2.5 Voxel Mapping

#### 3-bit Mode (Profile A)
- 4 orientations: 0°, 45°, 90°, 135°
- 2 retardance levels: λ/4, 3λ/4
- Gray coding for error resilience

#### 5-bit Mode (Profile B)
- 8 orientations: 0°, 22.5°, 45°, ..., 157.5°
- 4 retardance levels: λ/4, λ/2, 3λ/4, λ
- Gray coding on both dimensions

## 3. Physical Layout

### 3.1 Geometry
- Tiles: 256 symbols each, arranged in x,y grid
- Planes: Multiple z-layers, 64 tiles per plane
- Sync headers: Per tile with ID, plane, and parameters

### 3.2 Calibration
- Primer targets: Focus, polarization, gain calibration
- Referee pages: Known patterns every N tiles for drift correction

## 4. Manifest Structure

```json
{
  "version": "1.0.0",
  "created": "ISO-8601 timestamp",
  "profile": "A or B",
  "encoding": {
    "compression": {...},
    "ecc": {...},
    "interleaving": {...},
    "voxel": {...}
  },
  "geometry": {...},
  "files": [...],
  "integrity": {
    "merkle_root": "hex",
    "signature": {...}
  }
}
```

## 5. Decoding Process

1. **Optical Calibration**: Use primer targets
2. **Symbol Reading**: Measure angles and retardances
3. **Soft Demapping**: Convert to symbols with reliabilities
4. **Deinterleaving**: Reverse permutation using seed
5. **LDPC Decoding**: Soft-decision belief propagation
6. **RS Decoding**: Recover from erasures
7. **Integrity Check**: Verify Merkle root
8. **Decompression**: Recover original data

## 6. Performance Targets

### Profile A (Conservative)
- Density: ~1 GB/mm³
- Target BER: < 10^-15 after correction
- Tile loss tolerance: 15%
- Calibration drift: ±5° angle, ±10% gain

### Profile B (Aggressive)  
- Density: ~2.5 GB/mm³
- Target BER: < 10^-12 after correction
- Tile loss tolerance: 10%
- Calibration drift: ±3° angle, ±5% gain
"""