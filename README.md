# Futoshiki Puzzle Solver (CSP)

| | |
| :---: | --- |
| <a href="https://en.um.ac.ir/" target="_blank"><img src="./assets/FUM-Logo.png" alt="Ferdowsi University of Mashhad Logo" width="100"></a> | This project was developed as part of the Artificial Intelligence course by Computer Science students at the **Ferdowsi University of Mashhad (FUM)**. |

This is a full-stack web application designed to solve Futoshiki puzzles using Constraint Satisfaction Problem (CSP) techniques. It features a modern frontend built with React and a powerful backend powered by Python and FastAPI. The project is containerized with Docker for easy setup and deployment.

The backend implements two backtracking algorithms to solve the puzzle: a simple version and an optimized version with constraint propagation (forward checking), allowing for a performance comparison.

## Project Structure

- `Back-End/`: Contains the Python FastAPI source code, including API endpoints and solver logic.
- `Front-end/`: Contains the React + TypeScript + Vite source code for the user interface.
- `assets/`: Contains static assets like the university logo.
- `Dockerfile`: A single, multi-stage Dockerfile that builds the frontend, installs backend dependencies, and creates a single, optimized production image.
- `docker-compose.yaml`: A simple configuration file to easily build and run the production-like container on your local machine for testing.

---

## Running the Application

There are two primary ways to run this project: using Docker (recommended for consistency and easy setup) or running the services natively for local development.

### Method 1: Docker & Docker Compose (Recommended)

This method builds a single, production-ready container that serves both the frontend and the backend. It's the simplest way to run the entire application.

**Prerequisites:**

- Docker and Docker Compose are installed on your system.

**Instructions:**

1.  Clone the repository.
2.  Open your terminal in the project's root directory.
3.  Run the following command:

    ```sh
    docker compose up --build
    ```

4.  That's it! The application will be available at **[http://localhost:8000](http://localhost:8000)**.

The FastAPI server will handle all API requests (at `/api/...`) and serve the static React application.

### Method 2: Local Development (Without Docker)

This method allows you to run the frontend and backend servers separately, which is useful for development with features like hot-reloading.

**Prerequisites:**

- Python 3.12+ and Pip
- Node.js 20+ and npm

**Instructions:**

**1. Start the Backend Server:**

- Open a terminal.
- Navigate to the backend directory: `cd Back-End`
- Install dependencies: `pip install "fastapi[all]" uvicorn`
- Start the server: `uvicorn main:app --reload`
- The backend API will be running on **[http://localhost:8000](http://localhost:8000)**.

**2. Start the Frontend Server:**

- Open a **new terminal**.
- Navigate to the frontend directory: `cd Front-end`
- Install dependencies: `npm install`
- The frontend needs to know where the API is. Create a file named `.env.local` inside the `Front-end` directory and add the following line:
  ```
  VITE_API_BASE_URL=http://localhost:8000
  ```
- Start the development server: `npm run dev`
- The frontend will be available at **[http://localhost:5173](http://localhost:5173)** (or another port if 5173 is in use).

## Technology Stack

- **Backend**: Python 3.12, FastAPI, Uvicorn
- **Frontend**: React, TypeScript, Vite, CSS Modules
- **Containerization**: Docker, Docker Compose

---

## Authors

This project was developed by:

- **Arman Akhoondi** - _Backend Developer_
- **Amirreza Abbasian** - _Frontend Developer_

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
