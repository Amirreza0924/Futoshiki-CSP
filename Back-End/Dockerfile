# Use Python 3.12 slim base image for smaller size
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Configure pip to use alternative index or disable SSL verification (for restricted environments)
# Users can uncomment the following line if needed for registry access issues
# RUN pip config set global.trusted-host pypi.org && pip config set global.trusted-host pypi.python.org && pip config set global.trusted-host files.pythonhosted.org

# Upgrade pip
RUN pip install --upgrade pip

# Install project dependencies directly (avoiding Poetry SSL issues)
# Using specific versions from pyproject.toml to ensure compatibility
RUN pip install fastapi==0.115.14 uvicorn==0.35.0 || \
    pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org fastapi==0.115.14 uvicorn==0.35.0

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]