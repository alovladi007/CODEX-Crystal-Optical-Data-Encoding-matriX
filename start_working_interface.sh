#!/bin/bash

# Crystal Archive Working Interface Startup Script
echo "🔮 Starting Crystal Archive Working Interface..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Create necessary directories
mkdir -p uploads downloads

echo "🚀 Starting web server on http://localhost:5000"
echo "📱 Open your browser and go to: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the simple web interface
python3 simple_web_interface.py
