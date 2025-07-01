from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import traceback
import json
import uvicorn

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

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Problem Solver API"}

@app.post("/solve")
async def solve_problem(problem_data: problem):
    try:
        # Here you would implement the logic to solve the problem based on the provided data.
        # For now, we will just return the received data as a placeholder.

        return {
            "message": "Problem received",
            "problem_data": problem_data
        }
    except Exception as e:
        return {
            "message": "An error occurred while processing the problem",
            "error": str(e),
            "traceback": traceback.format_exc()
        }

if __name__ == "__main__":
    uvicorn.run(app, port=8000)
    # To run the server, use the command: uvicorn main:app --reload
    # This will start the FastAPI server on http://localhost:8000
