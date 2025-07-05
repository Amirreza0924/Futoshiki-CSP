from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import traceback
import uvicorn
import os
from optimized_backtrack import OptimizedSolver
from simple_backtrack import SimpleSolver
from fastapi.middleware.cors import CORSMiddleware


class CellPosition(BaseModel):
    row: int
    col: int

class ConstraintsList(BaseModel):
    direction: str
    position1: CellPosition
    position2: CellPosition
    type: str

class problem(BaseModel):
    Grid: List[List[Optional[int]]]
    Constraints: List[ConstraintsList]
    GridSize: int
    SolverType: str

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints (No Changes Needed) ---
@app.get("/api/")
async def read_root():
    return {"message": "Welcome to Futoshiki Problem Solver API"}

@app.post("/api/solve")
async def solve_problem(problem_data: problem):
    try:
        solver_type = problem_data.SolverType
        if solver_type == "optimized":
            solver = OptimizedSolver(
                grid=problem_data.Grid,
                constraints=problem_data.Constraints,
                grid_size=problem_data.GridSize,
            )
            solution = solver.solve()
        else:
            solver = SimpleSolver(
                grid=problem_data.Grid,
                constraints=problem_data.Constraints,
                grid_size=problem_data.GridSize,
            )
            solution = solver.solve()

        if solution["solution"] is None:
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


if os.path.exists("static/assets"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    raise HTTPException(status_code=404, detail="Frontend not found")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)