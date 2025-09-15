#!/usr/bin/env python3
"""
Simple web interface for Crystal Archive
Run with: python web_interface.py
"""

from flask import Flask, render_template, request, jsonify, send_file, flash, redirect, url_for
import os
import tempfile
import zipfile
from pathlib import Path
import json
from crystal_archive.archive.pipeline import encode_folder, decode_archive
from crystal_archive.archive.manifest import Manifest

app = Flask(__name__)
app.secret_key = 'crystal-archive-web-interface'

@app.route('/')
def index():
    """Main page with upload form."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    """Handle file upload and encoding."""
    if 'files' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('files')
    if not files or all(f.filename == '' for f in files):
        return jsonify({'error': 'No files selected'}), 400
    
    profile = request.form.get('profile', 'A')
    
    try:
        # Create temporary directory for upload
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            upload_dir = temp_path / 'upload'
            upload_dir.mkdir()
            
            # Save uploaded files
            for file in files:
                if file.filename:
                    file.save(upload_dir / file.filename)
            
            # Encode to crystal format
            output_dir = temp_path / 'crystal_output'
            output_path, manifest = encode_folder(
                upload_dir,
                output_dir,
                profile=profile,
                seed=42
            )
            
            # Create zip file for download
            zip_path = temp_path / 'crystal_archive.zip'
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for root, dirs, files in os.walk(output_dir):
                    for file in files:
                        file_path = Path(root) / file
                        arcname = file_path.relative_to(output_dir)
                        zipf.write(file_path, arcname)
            
            return send_file(
                zip_path,
                as_attachment=True,
                download_name='crystal_archive.zip',
                mimetype='application/zip'
            )
    
    except Exception as e:
        return jsonify({'error': f'Encoding failed: {str(e)}'}), 500

@app.route('/decode', methods=['POST'])
def decode_archive_web():
    """Handle crystal archive decoding."""
    if 'archive' not in request.files:
        return jsonify({'error': 'No archive uploaded'}), 400
    
    archive_file = request.files['archive']
    if archive_file.filename == '':
        return jsonify({'error': 'No archive selected'}), 400
    
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Save and extract archive
            archive_path = temp_path / 'archive.zip'
            archive_file.save(archive_path)
            
            with zipfile.ZipFile(archive_path, 'r') as zipf:
                zipf.extractall(temp_path / 'extracted')
            
            # Decode
            output_dir = temp_path / 'decoded'
            decode_archive(
                temp_path / 'extracted',
                output_dir
            )
            
            # Create zip file for download
            zip_path = temp_path / 'decoded_files.zip'
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for root, dirs, files in os.walk(output_dir):
                    for file in files:
                        file_path = Path(root) / file
                        arcname = file_path.relative_to(output_dir)
                        zipf.write(file_path, arcname)
            
            return send_file(
                zip_path,
                as_attachment=True,
                download_name='decoded_files.zip',
                mimetype='application/zip'
            )
    
    except Exception as e:
        return jsonify({'error': f'Decoding failed: {str(e)}'}), 500

@app.route('/demo')
def demo():
    """Run a demo encoding."""
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Create sample data
            sample_dir = temp_path / 'sample'
            sample_dir.mkdir()
            
            (sample_dir / 'demo.txt').write_text(
                "This is a Crystal Archive demo!\n"
                "Your data is now encoded in 5D optical crystal format.\n"
                "Perfect for long-term preservation."
            )
            
            # Encode
            output_dir = temp_path / 'crystal_output'
            output_path, manifest = encode_folder(
                sample_dir,
                output_dir,
                profile='A',
                seed=42
            )
            
            # Return manifest info
            return jsonify({
                'success': True,
                'manifest': manifest.data,
                'message': 'Demo encoding successful!'
            })
    
    except Exception as e:
        return jsonify({'error': f'Demo failed: {str(e)}'}), 500

if __name__ == '__main__':
    # Create templates directory
    os.makedirs('templates', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
