ARG NODE_VERSION=20.12.2

# --- Frontend Build Stage ---
FROM node:${NODE_VERSION}-slim AS frontend-builder
WORKDIR /app/frontend

# Install frontend dependencies
COPY --link Front-end/package.json Front-end/package-lock.json ./
RUN npm config set strict-ssl false && npm ci --production=false

# Copy frontend source and build
COPY --link Front-end/ ./
RUN npm run build

# --- Backend Build Stage ---
FROM python:3.12-slim AS backend-builder
WORKDIR /app

# Set environment variables for pip
ENV PIP_CACHE_DIR=/root/.cache/pip \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install Python dependencies
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org \
    "fastapi>=0.115.14,<0.116.0" "uvicorn>=0.35.0,<0.36.0"

# Copy backend source
COPY --link Back-End/ ./

# --- Final Production Stage ---
FROM python:3.12-slim AS final
WORKDIR /app

# Set environment variables
ENV PIP_CACHE_DIR=/root/.cache/pip \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NODE_ENV=production

# Create non-root user
RUN groupadd --system appuser && useradd --system --create-home --gid appuser appuser

# Install Python dependencies
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org \
    "fastapi>=0.115.14,<0.116.0" "uvicorn>=0.35.0,<0.36.0"

# Copy backend application
COPY --from=backend-builder /app/*.py ./

# Copy built frontend static files
COPY --from=frontend-builder /app/frontend/dist ./static

# Set permissions
RUN chown -R appuser:appuser /app

USER appuser

# Expose port (Render will set PORT env var)
EXPOSE 8000

# Start the FastAPI server with PORT environment variable support
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"] 