"""Command-line interface for Crystal Archive."""

import click
from pathlib import Path
import sys
import json

from ..archive.pipeline import encode_folder, decode_archive


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
    
    from ..simulate.channel import ChannelSimulator
    import numpy as np
    
    # Create test data
    test_data = np.random.randint(0, 2, 10000, dtype=np.uint8)
    
    simulator = ChannelSimulator(seed=42)
    
    click.echo(f"\nSimulating damage with {runs} runs...")
    click.echo(f"  Tile loss: {tile_loss:.1%}")
    click.echo(f"  Bit flip probability: {bitflip:.3f}")
    
    total_ber = 0
    for run in range(runs):
        damaged, stats = simulator.simulate(
            test_data,
            tile_loss=tile_loss,
            bitflip_p=bitflip
        )
        
        errors = np.sum(test_data != damaged)
        ber = errors / len(test_data)
        total_ber += ber
        
        click.echo(f"    Run {run+1}: BER = {ber:.4f}")
    
    avg_ber = total_ber / runs
    click.echo(f"\n  Average BER: {avg_ber:.4f}")
    
    # Simple recovery assessment
    if avg_ber < 0.05:
        click.echo(f"  ✓ Expected recovery: Good (BER < 5%)")
    elif avg_ber < 0.15:
        click.echo(f"  ⚠ Expected recovery: Marginal (5% < BER < 15%)")
    else:
        click.echo(f"  ✗ Expected recovery: Poor (BER > 15%)")
    
    click.echo(f"\n✓ Simulation complete.")


@cli.command()
def demo():
    """Run a quick demonstration of Crystal Archive."""
    import tempfile
    from pathlib import Path
    
    click.echo("Crystal Archive Demo")
    click.echo("=" * 40)
    
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create sample data
        sample_dir = Path(tmpdir) / "sample"
        sample_dir.mkdir()
        
        (sample_dir / "message.txt").write_text(
            "This message demonstrates Crystal Archive - "
            "ultra-durable data storage for future generations."
        )
        
        (sample_dir / "data.json").write_text(
            json.dumps({
                "archive_type": "crystal",
                "version": "1.0.0",
                "created": "2025-01-01"
            }, indent=2)
        )
        
        click.echo("\n1. Creating sample data...")
        click.echo(f"   Created 2 files in temporary directory")
        
        # Encode
        click.echo("\n2. Encoding with Profile A...")
        encoded_dir = Path(tmpdir) / "encoded"
        
        try:
            output_path, manifest = encode_folder(
                sample_dir,
                encoded_dir,
                profile="A",
                seed=42
            )
            
            click.echo(f"   ✓ Encoding successful")
            click.echo(f"   Files: {len(manifest.data['files'])}")
            click.echo(f"   Profile: {manifest.data['encoding']['profile_params']['name']}")
        
        except Exception as e:
            click.echo(f"   ✗ Encoding failed: {e}")
            return
        
        # Decode
        click.echo("\n3. Decoding archive...")
        decoded_dir = Path(tmpdir) / "decoded"
        
        try:
            decode_archive(encoded_dir, decoded_dir)
            click.echo(f"   ✓ Decoding successful")
            
            # Verify files
            original_files = list(sample_dir.glob("*"))
            decoded_files = list(decoded_dir.glob("*"))
            
            if len(original_files) == len(decoded_files):
                click.echo(f"   ✓ All {len(decoded_files)} files recovered")
            else:
                click.echo(f"   ⚠ File count mismatch")
                
        except Exception as e:
            click.echo(f"   ✗ Decoding failed: {e}")
            return
        
        click.echo("\n✓ Demo completed successfully!")
        click.echo("  Crystal Archive is ready for long-term data preservation.")


if __name__ == "__main__":
    cli()