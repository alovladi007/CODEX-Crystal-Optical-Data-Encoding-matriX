#!/bin/bash

# Crystal Archive Web Interface Startup Script
echo "🔮 Starting Crystal Archive Web Interface..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing Flask..."
    pip install Flask
fi

# Create necessary directories
mkdir -p uploads downloads

# Start the web interface
echo "🚀 Starting web server on http://localhost:5000"
echo "📱 Open your browser and go to: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

python3 web_interface.py
