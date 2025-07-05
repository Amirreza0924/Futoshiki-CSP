from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import traceback
import json
import uvicorn
import os
from optimized_backtrack import OptimizedSolver
from simple_backtrack import SimpleSolver
from fastapi.middleware.cors import CORSMiddleware


class CellPosition(BaseModel):
    row: int
    col: int


class ConstraintsList(BaseModel):
    direction: str  # "horizontal" or "vertical"
    position1: CellPosition
    position2: CellPosition
    type: str  # "greater" or "less"


class problem(BaseModel):
    Grid: List[List[Optional[int]]]  # 2D grid with optional integers
    Constraints: List[ConstraintsList]
    GridSize: int
    SolverType: str  # 'optimized' or 'basic'


app = FastAPI()

# origins = [
#     "http://localhost",
#     "http://localhost:5173"
# ]

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (frontend build)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/api/")
async def read_root():
    return {"message": "Welcome to Futoshiki Problem Solver API"}


# Serve frontend static files
@app.get("/")
async def serve_frontend():
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return {"message": "Frontend not available - API only mode"}


@app.post("/api/solve")
async def solve_problem(problem_data: problem):
    try:

        solver_type = problem_data.SolverType

        if solver_type == "optimized":  # Optimized Solver
            solver = OptimizedSolver(
                grid=problem_data.Grid,
                constraints=problem_data.Constraints,
                grid_size=problem_data.GridSize,
            )
            solution = solver.solve()

        else:  # Basic Solver (Basic Backtracking Solver)
            solver = SimpleSolver(
                grid=problem_data.Grid,
                constraints=problem_data.Constraints,
                grid_size=problem_data.GridSize,
            )
            solution = solver.solve()

        if solution["solution"] is None:
            # No solution found, return 422 with steps and other info
            raise HTTPException(
                status_code=422,
                detail={
                    "error": "No solution found for the given constraints.",
                    "backtracks": solution["backtracks"],
                    "time_taken": solution["time_taken"],
                    "steps": solution["steps"],
                },
            )

        return {"message": "Solotion Khedmat Shoma!", "solution": solution}

    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while processing the problem",
                "error": str(e),
                "traceback": traceback.format_exc(),
            },
        )


@app.post("/api/solve-compared")
async def solve_problem_comparison(problem_data: problem):
    try:

        optimized_solver = OptimizedSolver(
            grid=problem_data.Grid,
            constraints=problem_data.Constraints,
            grid_size=problem_data.GridSize,
        )
        optimized_solution = optimized_solver.solve()

        simple_solver = SimpleSolver(
            grid=problem_data.Grid,
            constraints=problem_data.Constraints,
            grid_size=problem_data.GridSize,
        )
        simple_solution = simple_solver.solve()

        return {
            "message": "Moghayese Khedmat Shoma!",
            "report": {
                "optimized_final_solution": optimized_solution["solution"],
                "simple_final_solution": simple_solution["solution"],
                "optimized_time": optimized_solution["time_taken"],
                "simple_time": simple_solution["time_taken"],
                "optimized_backtracks": optimized_solution["backtracks"],
                "simple_backtracks": simple_solution["backtracks"],
            },
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while processing the problem",
                "error": str(e),
                "traceback": traceback.format_exc(),
            },
        )


# Catch-all route to serve React app (for client-side routing)
@app.get("/{path:path}")
async def serve_frontend_routes(path: str):
    # Don't serve frontend files for API routes
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")

    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")

    raise HTTPException(status_code=404, detail="Page not found")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
    # To run the server, use the command: uvicorn main:app --reload
    # This will start the FastAPI server on http://localhost:8000
