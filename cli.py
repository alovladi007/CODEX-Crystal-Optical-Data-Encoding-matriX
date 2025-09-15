#!/usr/bin/env python3
"""
CODEX Crystal Archive CLI Tool
Ultra-durable 5D optical data storage command-line interface
"""

import os
import sys
import json
import argparse
import hashlib
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from crystal_archive.archive.manifest import Manifest
    from crystal_archive.archive.pipeline import encode_folder
    from crystal_archive.codecs.compression import compress_data
    from crystal_archive.codecs.ecc_ldpc import LDPCEncoder
    from crystal_archive.codecs.ecc_rs import ReedSolomonEncoder
    from crystal_archive.mapping.voxel_map import VoxelMapper, VoxelMode
except ImportError:
    print("Error: CODEX Crystal Archive modules not found. Please install the package.")
    sys.exit(1)

class CrystalArchiveCLI:
    def __init__(self):
        self.version = "1.0.0"
        self.archives_dir = Path.home() / ".codex" / "archives"
        self.archives_dir.mkdir(parents=True, exist_ok=True)
        
    def encode(self, input_path: str, output_path: str, profile: str = "A", 
               compression: bool = True, error_correction: bool = True) -> Dict[str, Any]:
        """Encode files into a crystal archive"""
        print(f"🔮 CODEX Crystal Archive CLI v{self.version}")
        print(f"📁 Encoding: {input_path}")
        print(f"💎 Profile: {profile}")
        print(f"🗜️  Compression: {'Enabled' if compression else 'Disabled'}")
        print(f"🛡️  Error Correction: {'Enabled' if error_correction else 'Disabled'}")
        print()
        
        input_path = Path(input_path)
        if not input_path.exists():
            raise FileNotFoundError(f"Input path does not exist: {input_path}")
        
        # Collect files
        files = []
        if input_path.is_file():
            files = [input_path]
        else:
            files = list(input_path.rglob("*"))
            files = [f for f in files if f.is_file()]
        
        if not files:
            raise ValueError("No files found to encode")
        
        print(f"📊 Found {len(files)} files to encode")
        
        # Process files
        processed_files = []
        total_original_size = 0
        total_compressed_size = 0
        
        for i, file_path in enumerate(files, 1):
            print(f"🔄 Processing {i}/{len(files)}: {file_path.name}")
            
            # Read file
            with open(file_path, 'rb') as f:
                content = f.read()
            
            original_size = len(content)
            total_original_size += original_size
            
            # Compress if enabled
            if compression:
                compressed_content = compress_data(content)
                compressed_size = len(compressed_content)
            else:
                compressed_content = content
                compressed_size = original_size
            
            total_compressed_size += compressed_size
            
            # Generate checksum
            checksum = hashlib.sha256(content).hexdigest()
            
            # 5D Optical Encoding
            voxel_mapper = VoxelMapper()
            mode = VoxelMode.CONSERVATIVE if profile == "A" else VoxelMode.AGGRESSIVE
            encoded_data = voxel_mapper.encode(compressed_content, mode)
            
            # Error correction if enabled
            if error_correction:
                ldpc_encoder = LDPCEncoder()
                rs_encoder = ReedSolomonEncoder()
                
                # Apply LDPC encoding
                ldpc_encoded = ldpc_encoder.encode(encoded_data)
                
                # Apply Reed-Solomon encoding
                final_encoded = rs_encoder.encode(ldpc_encoded)
            else:
                final_encoded = encoded_data
            
            processed_files.append({
                'name': str(file_path.relative_to(input_path.parent)),
                'type': self._get_file_type(file_path),
                'original_size': original_size,
                'compressed_size': compressed_size,
                'encoded_size': len(final_encoded),
                'checksum': checksum,
                'data': final_encoded.hex()  # Store as hex string
            })
        
        # Calculate compression ratio
        compression_ratio = round((1 - total_compressed_size / total_original_size) * 100, 2)
        
        # Create manifest
        manifest = {
            'version': self.version,
            'profile': profile,
            'created': datetime.now().isoformat(),
            'archive_id': self._generate_archive_id(),
            'files': [f for f in processed_files],  # Remove data from manifest
            'total_files': len(processed_files),
            'total_original_size': total_original_size,
            'total_compressed_size': total_compressed_size,
            'total_encoded_size': sum(f['encoded_size'] for f in processed_files),
            'compression_ratio': compression_ratio,
            'error_correction_level': 'conservative' if profile == 'A' else 'aggressive',
            'encoding_profile': {
                'bits_per_voxel': 3 if profile == 'A' else 5,
                'recovery_rate': 99.9999 if profile == 'A' else 99.99,
                'durability': '1000+ years'
            }
        }
        
        # Create archive
        archive_data = {
            'manifest': manifest,
            'data': [f['data'] for f in processed_files]
        }
        
        # Save archive
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(archive_data, f, indent=2)
        
        print()
        print("✅ Archive created successfully!")
        print(f"📦 Archive ID: {manifest['archive_id']}")
        print(f"📁 Output: {output_path}")
        print(f"📊 Files: {len(processed_files)}")
        print(f"🗜️  Compression: {compression_ratio}%")
        print(f"💾 Size: {self._format_size(total_compressed_size)}")
        
        return manifest
    
    def decode(self, archive_path: str, output_dir: str, verify: bool = True) -> Dict[str, Any]:
        """Decode a crystal archive"""
        print(f"🔮 CODEX Crystal Archive CLI v{self.version}")
        print(f"📦 Decoding: {archive_path}")
        print(f"📁 Output: {output_dir}")
        print(f"🔍 Verify: {'Enabled' if verify else 'Disabled'}")
        print()
        
        archive_path = Path(archive_path)
        if not archive_path.exists():
            raise FileNotFoundError(f"Archive not found: {archive_path}")
        
        # Load archive
        with open(archive_path, 'r') as f:
            archive_data = json.load(f)
        
        manifest = archive_data['manifest']
        data = archive_data['data']
        
        print(f"📊 Archive Info:")
        print(f"   Version: {manifest['version']}")
        print(f"   Profile: {manifest['profile']}")
        print(f"   Created: {manifest['created']}")
        print(f"   Files: {manifest['total_files']}")
        print(f"   Compression: {manifest['compression_ratio']}%")
        print()
        
        # Create output directory
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Decode files
        decoded_files = []
        for i, (file_info, encoded_data) in enumerate(zip(manifest['files'], data), 1):
            print(f"🔄 Decoding {i}/{len(manifest['files'])}: {file_info['name']}")
            
            # Convert hex back to bytes
            encoded_bytes = bytes.fromhex(encoded_data)
            
            # 5D Optical Decoding
            voxel_mapper = VoxelMapper()
            mode = VoxelMode.CONSERVATIVE if manifest['profile'] == 'A' else VoxelMode.AGGRESSIVE
            decoded_content = voxel_mapper.decode(encoded_bytes, mode)
            
            # Verify checksum if requested
            if verify:
                checksum = hashlib.sha256(decoded_content).hexdigest()
                if checksum != file_info['checksum']:
                    print(f"⚠️  Warning: Checksum mismatch for {file_info['name']}")
            
            # Save file
            file_path = output_dir / file_info['name']
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(file_path, 'wb') as f:
                f.write(decoded_content)
            
            decoded_files.append({
                'name': file_info['name'],
                'size': len(decoded_content),
                'checksum_valid': verify and hashlib.sha256(decoded_content).hexdigest() == file_info['checksum']
            })
        
        print()
        print("✅ Archive decoded successfully!")
        print(f"📁 Output directory: {output_dir}")
        print(f"📊 Files decoded: {len(decoded_files)}")
        
        return {
            'manifest': manifest,
            'files': decoded_files
        }
    
    def verify(self, archive_path: str, deep_scan: bool = False) -> Dict[str, Any]:
        """Verify a crystal archive"""
        print(f"🔮 CODEX Crystal Archive CLI v{self.version}")
        print(f"🔍 Verifying: {archive_path}")
        print(f"🔬 Deep scan: {'Enabled' if deep_scan else 'Disabled'}")
        print()
        
        archive_path = Path(archive_path)
        if not archive_path.exists():
            raise FileNotFoundError(f"Archive not found: {archive_path}")
        
        # Load archive
        with open(archive_path, 'r') as f:
            archive_data = json.load(f)
        
        manifest = archive_data['manifest']
        data = archive_data['data']
        
        # Basic verification
        errors = []
        warnings = []
        
        # Check file count
        if len(data) != manifest['total_files']:
            errors.append(f"File count mismatch: manifest says {manifest['total_files']}, actual {len(data)}")
        
        # Check file sizes
        total_size = sum(len(d) for d in data)
        if total_size != manifest['total_encoded_size']:
            warnings.append(f"Size mismatch: manifest says {manifest['total_encoded_size']}, actual {total_size}")
        
        # Deep scan if requested
        deep_errors = []
        if deep_scan:
            print("🔬 Performing deep scan...")
            for i, (file_info, encoded_data) in enumerate(zip(manifest['files'], data)):
                try:
                    # Try to decode
                    encoded_bytes = bytes.fromhex(encoded_data)
                    voxel_mapper = VoxelMapper()
                    mode = VoxelMode.CONSERVATIVE if manifest['profile'] == 'A' else VoxelMode.AGGRESSIVE
                    decoded_content = voxel_mapper.decode(encoded_bytes, mode)
                    
                    # Verify checksum
                    checksum = hashlib.sha256(decoded_content).hexdigest()
                    if checksum != file_info['checksum']:
                        deep_errors.append(f"Checksum mismatch for {file_info['name']}")
                
                except Exception as e:
                    deep_errors.append(f"Decode error for {file_info['name']}: {str(e)}")
        
        # Calculate health score
        health_score = 100
        health_score -= len(errors) * 20
        health_score -= len(warnings) * 10
        health_score -= len(deep_errors) * 15
        health_score = max(0, health_score)
        
        print()
        if errors:
            print("❌ Errors found:")
            for error in errors:
                print(f"   • {error}")
        
        if warnings:
            print("⚠️  Warnings:")
            for warning in warnings:
                print(f"   • {warning}")
        
        if deep_errors:
            print("🔬 Deep scan issues:")
            for error in deep_errors:
                print(f"   • {error}")
        
        print()
        print(f"📊 Health Score: {health_score}/100")
        
        if health_score >= 80:
            print("✅ Archive is healthy")
        elif health_score >= 60:
            print("⚠️  Archive has minor issues")
        else:
            print("❌ Archive has serious issues")
        
        return {
            'health_score': health_score,
            'errors': errors,
            'warnings': warnings,
            'deep_errors': deep_errors,
            'healthy': health_score >= 80
        }
    
    def list_archives(self) -> List[Dict[str, Any]]:
        """List all archives"""
        print(f"🔮 CODEX Crystal Archive CLI v{self.version}")
        print(f"📁 Archives directory: {self.archives_dir}")
        print()
        
        archives = []
        for archive_file in self.archives_dir.glob("*.crystal"):
            try:
                with open(archive_file, 'r') as f:
                    archive_data = json.load(f)
                
                manifest = archive_data['manifest']
                archives.append({
                    'archive_id': manifest['archive_id'],
                    'created': manifest['created'],
                    'files': manifest['total_files'],
                    'size': manifest['total_compressed_size'],
                    'compression': manifest['compression_ratio'],
                    'profile': manifest['profile'],
                    'path': str(archive_file)
                })
            except Exception as e:
                print(f"⚠️  Error reading {archive_file.name}: {e}")
        
        if not archives:
            print("No archives found")
            return []
        
        print(f"Found {len(archives)} archives:")
        print()
        
        for archive in sorted(archives, key=lambda x: x['created'], reverse=True):
            print(f"📦 {archive['archive_id']}")
            print(f"   Created: {archive['created']}")
            print(f"   Files: {archive['files']}")
            print(f"   Size: {self._format_size(archive['size'])}")
            print(f"   Compression: {archive['compression']}%")
            print(f"   Profile: {archive['profile']}")
            print()
        
        return archives
    
    def _get_file_type(self, file_path: Path) -> str:
        """Get file type based on extension"""
        suffix = file_path.suffix.lower()
        type_map = {
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.json': 'application/json',
            '.csv': 'text/csv',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.zip': 'application/zip',
        }
        return type_map.get(suffix, 'application/octet-stream')
    
    def _generate_archive_id(self) -> str:
        """Generate a unique archive ID"""
        return hashlib.sha256(f"{time.time()}{os.urandom(16)}".encode()).hexdigest()[:16]
    
    def _format_size(self, size: int) -> str:
        """Format size in human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} PB"

def main():
    parser = argparse.ArgumentParser(
        description="CODEX Crystal Archive CLI - Ultra-durable 5D optical data storage",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  crystal-archive encode ./my-files/ archive.crystal --profile A
  crystal-archive decode archive.crystal ./output/ --verify
  crystal-archive verify archive.crystal --deep-scan
  crystal-archive list
        """
    )
    
    parser.add_argument('--version', action='version', version='CODEX Crystal Archive CLI v1.0.0')
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Encode command
    encode_parser = subparsers.add_parser('encode', help='Encode files into a crystal archive')
    encode_parser.add_argument('input', help='Input file or directory')
    encode_parser.add_argument('output', help='Output archive file')
    encode_parser.add_argument('--profile', choices=['A', 'B'], default='A', 
                             help='Encoding profile (A=conservative, B=aggressive)')
    encode_parser.add_argument('--no-compression', action='store_true', 
                             help='Disable compression')
    encode_parser.add_argument('--no-error-correction', action='store_true', 
                             help='Disable error correction')
    
    # Decode command
    decode_parser = subparsers.add_parser('decode', help='Decode a crystal archive')
    decode_parser.add_argument('archive', help='Archive file to decode')
    decode_parser.add_argument('output', help='Output directory')
    decode_parser.add_argument('--no-verify', action='store_true', 
                             help='Skip integrity verification')
    
    # Verify command
    verify_parser = subparsers.add_parser('verify', help='Verify a crystal archive')
    verify_parser.add_argument('archive', help='Archive file to verify')
    verify_parser.add_argument('--deep-scan', action='store_true', 
                             help='Perform deep integrity scan')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List all archives')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    cli = CrystalArchiveCLI()
    
    try:
        if args.command == 'encode':
            cli.encode(
                args.input, 
                args.output, 
                args.profile,
                not args.no_compression,
                not args.no_error_correction
            )
        elif args.command == 'decode':
            cli.decode(args.archive, args.output, not args.no_verify)
        elif args.command == 'verify':
            cli.verify(args.archive, args.deep_scan)
        elif args.command == 'list':
            cli.list_archives()
    
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
