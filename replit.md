# Overview

Crystal Archive is an ultra-durable archival system designed for 5D optical "crystal" media storage, built to preserve data for millennia. The system implements a comprehensive archival pipeline that packs folders into binary blobs, applies multi-layer compression and error correction, maps data to 5D voxel symbols using optical properties (orientation and retardance), and generates self-describing OAIS-compliant manifests with embedded decoding instructions.

The system targets extreme durability scenarios where conventional storage fails, providing resilience against significant data corruption through advanced error correction codes and redundant encoding strategies. It supports damage simulation for testing resilience against various failure modes including bit errors, tile loss, and calibration drift.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Pipeline Architecture
The system follows a layered archival pipeline with clear separation of concerns:

**Data Packing Layer**: Converts folder structures into single binary blobs with metadata tracking using a custom packer that maintains file hierarchy and integrity information.

**Compression Layer**: Implements multiple compression codecs (zstandard, xz) with configurable compression levels and version tracking for future compatibility.

**Error Correction Layer**: Uses a dual-layer approach with inner LDPC (Low-Density Parity-Check) codes for soft-decision decoding and outer Reed-Solomon erasure coding for burst error protection. This provides resilience against both random bit errors and complete data tile losses.

**Interleaving Layer**: Applies block and convolutional interleaving with pseudo-random permutations to distribute burst errors across multiple codewords, improving error correction effectiveness.

**Voxel Mapping Layer**: Converts binary data to 5D optical symbols using orientation angles and retardance levels with Gray coding to minimize error propagation. Supports multiple encoding profiles (3-bit conservative, 5-bit aggressive) with different capacity/reliability tradeoffs.

## Encoding Profiles System
The system implements a profile-based approach for different use cases:

**Profile A (Conservative)**: 3 bits/voxel with LDPC rate 0.75, 20% Reed-Solomon overhead, and deep interleaving. Targets 99.9999% recovery with 15% tile loss.

**Profile B (Aggressive)**: 5 bits/voxel with LDPC rate 0.83, 12% Reed-Solomon overhead, optimized for higher density storage with reduced error margins.

## Data Integrity Architecture
Multi-level integrity verification using SHA-256 hashing, Merkle trees for hierarchical verification, and optional Ed25519 digital signatures. The manifest system embeds complete decoding instructions for long-term accessibility without external dependencies.

## Simulation Framework
Comprehensive damage modeling supporting multiple failure modes (bitflips, tile loss, plane erasure, calibration drift, Gaussian noise) with statistical analysis capabilities for validating system resilience under various conditions.

## Command-Line Interface
Click-based CLI providing encode, decode, simulate, verify, and demo commands with comprehensive error handling and progress reporting.

# External Dependencies

## Core Scientific Libraries
- **numpy**: Numerical computing for array operations, statistical analysis, and mathematical transformations in error correction and voxel mapping
- **scipy**: Advanced signal processing algorithms used in LDPC decoding and channel simulation
- **matplotlib**: Visualization for simulation results, error rate plots, and system performance analysis

## Compression and Encoding
- **zstandard**: Primary compression codec with configurable levels and streaming support
- **reedsolo**: Reed-Solomon error correction implementation for erasure coding layer

## Cryptography and Security  
- **pynacl**: Ed25519 digital signatures for archive authentication and PyNaCl cryptographic primitives

## Command-Line Interface
- **click**: Command-line argument parsing, subcommands, and user interaction handling

## Development and Testing
- **pytest**: Unit testing framework with coverage reporting
- **pytest-cov**: Code coverage analysis for test suite validation
- **mypy**: Static type checking for code quality assurance  
- **ruff**: Code linting and formatting for consistent code style

## Build System
- **setuptools**: Python package building and distribution
- **wheel**: Modern Python package format for efficient installation

The system is designed to be self-contained with minimal external dependencies, prioritizing long-term stability and reproducibility of the archival process.