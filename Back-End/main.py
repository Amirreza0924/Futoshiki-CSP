from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import traceback
import json
import uvicorn
from optimized_backtrack import OptimizedSolver
from simple_backtrack import SimpleSolver
from fastapi.middleware.cors import CORSMiddleware

class CellPosition(BaseModel):
    row: int
    col: int

class ConstraintsList(BaseModel):
    direction: str # "horizontal" or "vertical"
    position1: CellPosition
    position2: CellPosition
    type: str # "greater" or "less"

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

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to Futoshiki Problem Solver API"}

@app.post("/solve")
async def solve_problem(problem_data: problem):
    try:
        
        solver_type = problem_data.SolverType

        if solver_type == 'optimized': # Optimized Solver
            solver = OptimizedSolver(
                grid=problem_data.Grid,
                constraints=problem_data.Constraints,
                grid_size=problem_data.GridSize
            )
            solution = solver.solve()

        else: # Basic Solver (Basic Backtracking Solver)
            solver = SimpleSolver(
                grid=problem_data.Grid,
                constraints=problem_data.Constraints,
                grid_size=problem_data.GridSize
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
                    "steps": solution["steps"]
                }
            )

        return {
            "message": "Solotion Khedmat Shoma!",
            "solution": solution
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while processing the problem",
                "error": str(e),
                "traceback": traceback.format_exc()
            }
        )
    
@app.post("/solve-compared")
async def solve_problem_comparison(problem_data: problem):
    try:

        optimized_solver = OptimizedSolver(
            grid=problem_data.Grid,
            constraints=problem_data.Constraints,
            grid_size=problem_data.GridSize
        )
        optimized_solution = optimized_solver.solve()

        simple_solver = SimpleSolver(
            grid=problem_data.Grid,
            constraints=problem_data.Constraints,
            grid_size=problem_data.GridSize
        )
        simple_solution = simple_solver.solve()

        return {
            "message": "Moghayese Khedmat Shoma!",
            "report": {
                "optimized_final_solution": optimized_solution['solution'],
                "simple_final_solution": simple_solution['solution'],
                "optimized_time": optimized_solution['time_taken'],
                "simple_time": simple_solution['time_taken'],
                "optimized_backtracks": optimized_solution['backtracks'],
                "simple_backtracks": simple_solution['backtracks'],
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while processing the problem",
                "error": str(e),
                "traceback": traceback.format_exc()
            }
        )

if __name__ == "__main__":
    uvicorn.run(app, port=8000)
    # To run the server, use the command: uvicorn main:app --reload
    # This will start the FastAPI server on http://localhost:8000
