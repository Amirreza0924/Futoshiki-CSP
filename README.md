# Futoshiki-CSP

A Futoshiki puzzle solver with both simple and optimized backtracking algorithms, featuring a React frontend and FastAPI backend.

## Features

- **Dual Solver Implementation**: Simple backtracking and optimized backtracking with MRV, LCV, Forward Checking, and AC-2 algorithms
- **Interactive Web Interface**: React-based UI for puzzle creation and solving
- **Performance Comparison**: Compare solving times and backtrack counts between algorithms
- **Step-by-Step Visualization**: View the solving process step by step
- **RESTful API**: FastAPI backend with comprehensive endpoints

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Internet connection for downloading base images

### Running the Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Amirreza0924/Futoshiki-CSP.git
   cd Futoshiki-CSP
   ```

2. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Docker Troubleshooting

#### Registry Access Issues (Common in Iran)

If you encounter "500 Internal Server Error" when building Docker images, this is often due to Docker registry access restrictions. Here are solutions:

##### Solution 1: Use Registry Mirrors

Configure Docker to use alternative registries by creating or editing `/etc/docker/daemon.json`:

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://dockerhub.azk8s.cn",
    "https://reg-mirror.qiniu.com"
  ]
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
```

##### Solution 2: Use Iranian Registry Mirrors

For users in Iran, consider using local registry mirrors:

```json
{
  "registry-mirrors": [
    "https://registry.hub.docker.com.mirror.org",
    "https://dockerhub.ir"
  ]
}
```

##### Solution 3: Build with Alternative Base Images

If registry issues persist, you can modify the Dockerfiles to use alternative base images:

**For Backend (Back-End/Dockerfile)**:
```dockerfile
# Replace: FROM python:3.12-slim
# With: FROM python:3.12-slim-bullseye
```

**For Frontend (Front-end/Dockerfile)**:
```dockerfile
# Replace: FROM node:18-alpine
# With: FROM node:18-bullseye
```

##### Solution 4: Manual Image Pull

Pre-pull required images manually:
```bash
docker pull python:3.12-slim
docker pull node:18-alpine
docker pull nginx:alpine
```

#### Common Docker Issues

1. **Port Already in Use**:
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :8000
   # Kill the process or change ports in compose.yaml
   ```

2. **Permission Denied**:
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   # Logout and login again
   ```

3. **Out of Disk Space**:
   ```bash
   # Clean up Docker resources
   docker system prune -a
   ```

## Development Setup

### Backend Development

1. **Navigate to backend directory**:
   ```bash
   cd Back-End
   ```

2. **Install Poetry** (if not already installed):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

3. **Install dependencies**:
   ```bash
   poetry install
   ```

4. **Run the development server**:
   ```bash
   poetry run uvicorn main:app --reload
   ```

### Frontend Development

1. **Navigate to frontend directory**:
   ```bash
   cd Front-end
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /` - Welcome message
- `POST /solve` - Solve a puzzle with specified solver type
- `POST /solve-compared` - Compare both solvers on the same puzzle

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).