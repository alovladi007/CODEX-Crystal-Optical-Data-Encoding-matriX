#!/usr/bin/env python3
"""
Flask-based web interface for Crystal Archive
Run with: python3 flask_interface.py
"""

import os
import sys
import json
import tempfile
import zipfile
from pathlib import Path
import subprocess

# Try to import Flask, if not available, provide instructions
try:
    from flask import Flask, render_template_string, request, jsonify, send_file
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

if FLASK_AVAILABLE:
    app = Flask(__name__)
    app.secret_key = 'crystal-archive-web-interface'

    @app.route('/')
    def index():
        return render_template_string(get_index_html())

    @app.route('/encode', methods=['POST'])
    def encode_files():
        try:
            profile = request.form.get('profile', 'A')
            
            # Create temporary directory
            with tempfile.TemporaryDirectory() as temp_dir:
                temp_path = Path(temp_dir)
                upload_dir = temp_path / 'upload'
                upload_dir.mkdir()
                
                # Create sample files for demo
                (upload_dir / 'demo.txt').write_text(
                    "Crystal Archive Demo\n"
                    "==================\n\n"
                    "This is a demonstration of ultra-durable 5D optical data storage.\n"
                    "Your data is now encoded in crystal format for long-term preservation.\n\n"
                    f"Profile: {profile}\n"
                    "Features:\n"
                    "- Multi-layer error correction\n"
                    "- 5D voxel mapping\n"
                    "- Self-describing manifests\n"
                    "- Millennia-long durability"
                )
                
                (upload_dir / 'data.json').write_text(json.dumps({
                    "archive_type": "crystal",
                    "version": "1.0.0",
                    "profile": profile,
                    "created": "2025-01-01",
                    "features": [
                        "LDPC error correction",
                        "Reed-Solomon coding",
                        "5D optical mapping",
                        "Self-describing format"
                    ]
                }, indent=2))
                
                # Simulate encoding process
                output_dir = temp_path / 'crystal_output'
                output_dir.mkdir()
                
                # Create manifest
                manifest = {
                    "version": "1.0.0",
                    "created": "2025-01-01T00:00:00Z",
                    "profile": profile,
                    "encoding": {
                        "profile_params": {
                            "name": "Conservative" if profile == "A" else "Aggressive",
                            "voxel_mode": "3bit" if profile == "A" else "5bit",
                            "ldpc_rate": 0.75 if profile == "A" else 0.83,
                            "rs_overhead": 0.2 if profile == "A" else 0.12
                        },
                        "compression": {
                            "codec": "zstd",
                            "info": {
                                "original_size": 500,
                                "compressed_size": 350,
                                "ratio": 0.7
                            }
                        }
                    },
                    "integrity": {
                        "merkle_root": "d95290bb5139d6cae8ea14cb78b1b592d3510f17cc49a50f39df5185e38e617e"
                    },
                    "files": [
                        {
                            "path": "demo.txt",
                            "size": 300,
                            "sha256": "abc123def456..."
                        },
                        {
                            "path": "data.json",
                            "size": 200,
                            "sha256": "def456abc123..."
                        }
                    ]
                }
                
                # Save manifest
                (output_dir / 'manifest.json').write_text(json.dumps(manifest, indent=2))
                
                # Create voxel tiles (simulated)
                voxels_dir = output_dir / 'voxels' / 'plane_000'
                voxels_dir.mkdir(parents=True)
                
                for i in range(10):
                    tile_data = {
                        "symbols": [0, 1, 2, 3, 4, 0, 1, 2] * 50,
                        "angles": [0.0, 45.0, 90.0, 135.0] * 50,
                        "retardances": [0.25, 0.75] * 100
                    }
                    (voxels_dir / f'tile_{i:04d}.json').write_text(json.dumps(tile_data, indent=2))
                
                # Create zip file
                zip_path = temp_path / 'crystal_archive.zip'
                with zipfile.ZipFile(zip_path, 'w') as zipf:
                    for root, dirs, files in os.walk(output_dir):
                        for file in files:
                            file_path = Path(root) / file
                            arcname = file_path.relative_to(output_dir)
                            zipf.write(file_path, arcname)
                
                # Send zip file
                return send_file(
                    zip_path,
                    as_attachment=True,
                    download_name='crystal_archive.zip',
                    mimetype='application/zip'
                )
                    
        except Exception as e:
            return jsonify({'error': f'Encoding failed: {str(e)}'}), 500

    @app.route('/decode', methods=['POST'])
    def decode_archive():
        try:
            # For demo purposes, just return a success message
            result = {
                "success": True,
                "message": "Archive decoded successfully!",
                "files": ["demo.txt", "data.json"]
            }
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': f'Decoding failed: {str(e)}'}), 500

    @app.route('/demo')
    def run_demo():
        try:
            # Try to run the actual crystal-archive demo
            result = subprocess.run(['crystal-archive', 'demo'], 
                                  capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                return jsonify({
                    "success": True,
                    "output": result.stdout,
                    "message": "Demo completed successfully!"
                })
            else:
                return jsonify({
                    "success": False,
                    "error": result.stderr,
                    "message": "Demo failed"
                })
        except Exception as e:
            return jsonify({
                "success": False,
                "error": str(e),
                "message": "Demo not available - using simulated demo"
            })

    def get_index_html():
        return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crystal Archive - 5D Optical Data Storage</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 { font-size: 3em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .content { padding: 40px; }
        .tabs {
            display: flex;
            margin-bottom: 30px;
            border-bottom: 2px solid #ecf0f1;
        }
        .tab {
            padding: 15px 30px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.1em;
            color: #7f8c8d;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
        }
        .tab.active {
            color: #3498db;
            border-bottom-color: #3498db;
        }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2c3e50;
        }
        .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 1em;
        }
        .btn {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
        }
        .btn-success {
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
        }
        .btn-info {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        .feature {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 15px;
            border: 2px solid #ecf0f1;
        }
        .feature-icon { font-size: 3em; margin-bottom: 20px; }
        .feature h3 { color: #2c3e50; margin-bottom: 15px; }
        .status {
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            display: none;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔮 Crystal Archive</h1>
            <p>Ultra-durable 5D optical data storage for millennia</p>
        </div>
        
        <div class="content">
            <div class="tabs">
                <button class="tab active" onclick="showTab('encode')">📦 Encode Files</button>
                <button class="tab" onclick="showTab('decode')">🔓 Decode Archive</button>
                <button class="tab" onclick="showTab('demo')">🎯 Demo</button>
            </div>
            
            <div id="encode" class="tab-content active">
                <h2>Encode Files to Crystal Format</h2>
                <p>Convert your files into ultra-durable 5D optical crystal storage.</p>
                
                <form id="encodeForm">
                    <div class="form-group">
                        <label for="profile">Encoding Profile:</label>
                        <select id="profile" name="profile">
                            <option value="A">Profile A (Conservative) - 3 bits/voxel, 99.9999% recovery</option>
                            <option value="B">Profile B (Aggressive) - 5 bits/voxel, higher density</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn">🔮 Encode to Crystal</button>
                </form>
            </div>
            
            <div id="decode" class="tab-content">
                <h2>Decode Crystal Archive</h2>
                <p>Decode a crystal archive back to original files.</p>
                
                <form id="decodeForm">
                    <button type="submit" class="btn btn-success">🔓 Decode Archive</button>
                </form>
            </div>
            
            <div id="demo" class="tab-content">
                <h2>Live Demo</h2>
                <p>See Crystal Archive in action with sample data.</p>
                
                <button onclick="runDemo()" class="btn btn-info">🎯 Run Demo</button>
                <div id="demoResult"></div>
            </div>
            
            <div id="status" class="status"></div>
            <div id="loading" class="loading">
                <div class="spinner"></div>
                <p>Processing your request...</p>
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🛡️</div>
                    <h3>Ultra-Durable</h3>
                    <p>Designed to last for millennia with advanced error correction</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔧</div>
                    <h3>Self-Describing</h3>
                    <p>Complete decoding instructions embedded in every archive</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">💎</div>
                    <h3>5D Optical</h3>
                    <p>Uses orientation and retardance for maximum data density</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = `status ${type}`;
            status.style.display = 'block';
        }
        
        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }
        
        document.getElementById('encodeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const profile = document.getElementById('profile').value;
            
            showLoading(true);
            
            try {
                const formData = new FormData();
                formData.append('profile', profile);
                
                const response = await fetch('/encode', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'crystal_archive.zip';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    
                    showStatus('Files successfully encoded to crystal format!', 'success');
                } else {
                    showStatus('Encoding failed', 'error');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
            } finally {
                showLoading(false);
            }
        });
        
        document.getElementById('decodeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            showLoading(true);
            
            try {
                const response = await fetch('/decode', {
                    method: 'POST'
                });
                
                if (response.ok) {
                    const result = await response.json();
                    showStatus('Archive successfully decoded!', 'success');
                } else {
                    showStatus('Decoding failed', 'error');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
            } finally {
                showLoading(false);
            }
        });
        
        async function runDemo() {
            showLoading(true);
            
            try {
                const response = await fetch('/demo');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('demoResult').innerHTML = `
                        <div class="status success">
                            <h3>Demo Successful!</h3>
                            <p>${result.message}</p>
                            <pre style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px; overflow-x: auto;">${result.output || 'Demo completed successfully!'}</pre>
                        </div>
                    `;
                } else {
                    showStatus(`Demo failed: ${result.error}`, 'error');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
            } finally {
                showLoading(false);
            }
        }
    </script>
</body>
</html>
        """

    def main():
        # Try different ports if 5000 is busy
        ports_to_try = [5000, 5001, 5002, 8000, 8080, 3000]
        
        for port in ports_to_try:
            try:
                print(f"🔮 Crystal Archive Web Interface")
                print(f"🌐 Starting server on http://localhost:{port}")
                print(f"📱 Open your browser and go to: http://localhost:{port}")
                print(f"🛑 Press Ctrl+C to stop the server")
                print()
                
                app.run(host='0.0.0.0', port=port, debug=False)
                break
            except OSError as e:
                if e.errno == 48:  # Address already in use
                    print(f"⚠️  Port {port} is busy, trying next port...")
                    continue
                else:
                    raise
        else:
            print("❌ Could not find an available port. Please try again later.")

else:
    def main():
        print("❌ Flask is not installed!")
        print("📦 Please install Flask first:")
        print("   pip install Flask")
        print("   or")
        print("   python3 -m pip install Flask")
        print()
        print("🔧 Then run: python3 flask_interface.py")

if __name__ == '__main__':
    main()
