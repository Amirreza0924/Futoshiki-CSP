# Futoshiki-CSP

## Deployment Options

### 1. Production Deployment (Render, Heroku, etc.)

For production deployment on platforms like Render, use the root `Dockerfile`:

```sh
# Build the full-stack application
docker build -t futoshiki-csp .
docker run -p 8000:8000 futoshiki-csp
```

This creates a single container that:

- Builds the React frontend as static files
- Serves the frontend and API from the same FastAPI server
- API endpoints are available at `/api/*`
- Frontend is served at `/` with client-side routing support
- Supports dynamic port assignment via `PORT` environment variable

### 2. Development with Docker Compose

For local development with separate frontend and backend services:

```sh
docker compose up --build
```

This will build and start both services:

- Access the back-end API at [http://localhost:8000](http://localhost:8000)
- Access the front-end at [http://localhost:5173](http://localhost:5173)

### 3. Development Setup

For local development without Docker:

**Backend:**

```sh
cd Back-End
pip install fastapi uvicorn
uvicorn main:app --reload
```

**Frontend:**

```sh
cd Front-end
npm install
# Create .env file with: VITE_API_URL=http://127.0.0.1:8000/api
npm run dev
```

### Service Details

- **Back-End**
  - Python 3.12 (slim)
  - FastAPI framework
  - Production: serves both API and static files
  - Development: API only on port 8000
- **Front-End**
  - Node.js 20.12.2 (slim)
  - React + TypeScript + Vite
  - Production: built as static files
  - Development: dev server on port 5173

### Environment Variables

- `PORT`: Server port (default: 8000, automatically set by hosting platforms)
- `VITE_API_URL`: API base URL for frontend (development only)

### Notes

- Both services run as non-root users inside their containers for improved security.
- The production build serves everything from a single container on one port.
- API endpoints are prefixed with `/api/` in production to avoid conflicts with frontend routes.
- All services are connected via the `futoshiki-net` Docker network in development.
