FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY pyproject.toml ./
COPY requirements-web.txt ./
RUN pip install --no-cache-dir -e . && \
    pip install --no-cache-dir -r requirements-web.txt

# Copy source code
COPY src/ ./src/
COPY web_interface.py ./
COPY templates/ ./templates/

# Create directories for uploads and downloads
RUN mkdir -p uploads downloads

# Expose port
EXPOSE 5000

# Run web interface
CMD ["python", "web_interface.py"]
