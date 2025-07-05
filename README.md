# Futoshiki-CSP

## Running with Docker

This project provides Dockerfiles for both the Python back-end (FastAPI) and the TypeScript front-end (Vite/React), along with a `docker-compose.yml` for easy orchestration.

### Requirements
- Docker and Docker Compose installed
- No additional environment variables are required by default

### Service Details
- **Back-End**
  - Python 3.12 (slim)
  - Uses Poetry for dependency management
  - Exposes port **8000** (FastAPI)
- **Front-End**
  - Node.js **20.12.2** (slim)
  - Built with Vite
  - Exposes port **5173** (Vite preview server)

### Build and Run
From the project root directory, run:

\```sh
docker compose up --build
\```

This will build and start both services:
- Access the back-end API at [http://localhost:8000](http://localhost:8000)
- Access the front-end at [http://localhost:5173](http://localhost:5173)

### Notes
- Both services run as non-root users inside their containers for improved security.
- The front-end service depends on the back-end and will wait for it to be available.
- All services are connected via the `futoshiki-net` Docker network.
