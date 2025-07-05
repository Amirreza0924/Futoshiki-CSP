FROM python:3.12-slim AS base

# Set environment variables for pip
ENV PIP_CACHE_DIR=/root/.cache/pip \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Builder stage: install dependencies
FROM base AS builder
WORKDIR /app

# Copy only dependency files first for better cache usage
COPY --link pyproject.toml ./

# Install dependencies using pip with pyproject.toml
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org \
    "fastapi>=0.115.14,<0.116.0" "uvicorn>=0.35.0,<0.36.0"

# Copy application code
COPY --link main.py optimized_backtrack.py simple_backtrack.py utils.py ./

# Final stage: minimal image with non-root user
FROM base AS final
WORKDIR /app

# Create non-root user
RUN groupadd --system appuser && useradd --system --create-home --gid appuser appuser

# Install dependencies in final stage
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org \
    "fastapi>=0.115.14,<0.116.0" "uvicorn>=0.35.0,<0.36.0"

# Copy application code
COPY --link main.py optimized_backtrack.py simple_backtrack.py utils.py ./

# Set permissions for the non-root user
RUN chown -R appuser:appuser /app

USER appuser

# Expose FastAPI default port
EXPOSE 8000

# Entrypoint: run the FastAPI app with uvicorn
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
