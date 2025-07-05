ARG NODE_VERSION=20.12.2

# --- Frontend Build Stage ---
# This stage builds your React/Vue/etc. application into static files.
FROM node:${NODE_VERSION}-slim AS frontend-builder
WORKDIR /app/frontend

# Install frontend dependencies
# Using --link is fine, but not strictly necessary in most modern builders.
COPY Front-end/package.json Front-end/package-lock.json ./
# Note: --production=false is deprecated. Use --omit=dev if you want to skip dev dependencies.
# For a build step, you usually need dev dependencies, so `npm ci` is correct.
RUN npm ci

# Copy frontend source and build
COPY Front-end/ ./
RUN npm run build

# --- Backend Dependencies Stage ---
# This stage installs the Python dependencies into a specific location.
FROM python:3.12-slim AS backend-deps
WORKDIR /app

# Set environment variables for pip
ENV PIP_NO_CACHE_DIR=off \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install Python dependencies into the image. We will copy them later.
RUN pip install \
    --trusted-host pypi.org \
    --trusted-host pypi.python.org \
    --trusted-host files.pythonhosted.org \
    "fastapi>=0.115.14,<0.116.0" "uvicorn>=0.35.0,<0.36.0"

# --- Final Production Stage ---
# This is the final, small image that will run your application.
FROM python:3.12-slim AS final
WORKDIR /app

# Set environment variables for runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NODE_ENV=production

# Create a non-root user to run the application
RUN groupadd --system appuser && useradd --system --create-home --gid appuser appuser

# Copy the installed Python dependencies from the backend-deps stage
COPY --from=backend-deps /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=backend-deps /usr/local/bin /usr/local/bin

# Copy backend application source code
COPY Back-End/*.py ./

# Copy built frontend static files from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./static

# Set correct ownership for the app directory
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the port your app runs on
EXPOSE 8000

# Start the FastAPI server
# This command correctly uses the PORT variable provided by platforms like Liara/Render,
# with a fallback to 8000 for local development.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]