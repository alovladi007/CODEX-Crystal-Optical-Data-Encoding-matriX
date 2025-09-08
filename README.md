# Crystal Archive

Ultra-durable archival stack for 5D optical "crystal" media with advanced error correction.

## Features

- **Compression**: zstandard and xz with version tracking
- **Error Correction**: 
  - Inner layer: LDPC (Low-Density Parity-Check) with soft-decision decoding
  - Outer layer: Reed-Solomon erasure coding
- **5D Voxel Mapping**: Orientation and retardance encoding with Gray coding
- **Data Integrity**: SHA-256 hashing, Merkle trees, Ed25519 signatures
- **Self-Describing**: OAIS-compliant manifests with embedded decoding instructions
- **Damage Simulation**: Test resilience against bit errors, tile loss, calibration drift

## Quick Start

```bash
# Install
pip install -e .

# Run demo (demonstrates full encode/decode cycle)
crystal-archive demo

# Encode a folder
crystal-archive encode examples/sample_data --out build/voxel --profile A

# Simulate damage and test recovery
crystal-archive simulate --tile-loss 0.15 --bitflip 0.01 --runs 5

# Decode back
crystal-archive decode build/voxel --out build/recovered

# Verify integrity
crystal-archive verify build/voxel
```

## Encoding Profiles

### Profile A (Conservative)
- 3 bits/voxel (4 orientations × 2 retardance levels)
- LDPC rate 0.75 with soft-decision decoding
- Reed-Solomon +20% overhead
- Deep interleaving across 16+ planes
- Target: 99.9999% recovery with 15% tile loss

### Profile B (Aggressive)
- 5 bits/voxel (8 orientations × 4 levels)
- LDPC rate 0.83
- Reed-Solomon +12% overhead
- Interleaving across 8+ planes
- Higher density, lower margin

## Architecture

```
Folder → Pack → Compress → Shard → LDPC → Interleave → Map to Voxels → Crystal
                    ↓
                Manifest (self-describing parameters + integrity)
```

## CLI Commands

- `crystal-archive demo` - Run interactive demonstration
- `crystal-archive encode <folder> --out <dir>` - Encode folder to crystal format
- `crystal-archive decode <voxels> --out <dir>` - Decode archive back to files  
- `crystal-archive verify <voxels>` - Verify archive integrity
- `crystal-archive simulate` - Run damage resilience simulations

## Project Structure

- `src/crystal_archive/` - Main package
  - `archive/` - Encoding/decoding pipeline and manifest
  - `codecs/` - Compression and error correction
  - `mapping/` - 5D voxel symbol mapping
  - `simulate/` - Damage models and channel simulation
  - `cli/` - Command-line interface
- `examples/` - Sample data for testing
- `tests/` - Test suite

## Development

```bash
# Install in development mode
pip install -e .[dev]

# Run tests
pytest tests/

# Check code quality
ruff check src/
mypy src/crystal_archive
```

## License

MIT License - See LICENSE file for details