FROM python:3.12-slim AS base

# Set environment variables for Poetry
ENV POETRY_VERSION=1.8.2 \
    POETRY_CACHE_DIR=/root/.cache/pypoetry \
    PIP_CACHE_DIR=/root/.cache/pip

# Builder stage: install dependencies
FROM base AS builder
WORKDIR /app

# Install Poetry
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    pip install "poetry==${POETRY_VERSION}"

# Copy only dependency files first for better cache usage
COPY --link pyproject.toml poetry.lock ./

# Install dependencies (main only, no dev), create in-project venv
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    --mount=type=cache,target=$POETRY_CACHE_DIR \
    poetry config virtualenvs.in-project true && \
    poetry install --no-root --only main

# Copy application code
COPY --link main.py optimized_backtrack.py simple_backtrack.py utils.py ./

# Final stage: minimal image with non-root user
FROM base AS final
WORKDIR /app

# Create non-root user
RUN groupadd --system appuser && useradd --system --create-home --gid appuser appuser

# Copy virtual environment and app code from builder
COPY --link --from=builder /app /app

# Set permissions for the non-root user
RUN chown -R appuser:appuser /app

USER appuser

# Expose FastAPI default port
EXPOSE 8000

# Entrypoint: run the FastAPI app with uvicorn
ENTRYPOINT [".venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
