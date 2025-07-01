# simple_backtrack.py
import time
from utils import is_valid

class SimpleSolver:
    def __init__(self, grid, constraints, grid_size):
        self.grid = [row[:] for row in grid]
        self.constraints = constraints
        self.grid_size = grid_size
        self.backtrack_count = 0
        self.steps = []

    def solve(self):
        """
        Public method to start the solving process.
        """
        start_time = time.time()
        solution_found = self._backtrack()
        end_time = time.time()

        return {
            "solution": self.grid if solution_found else None,
            "backtracks": self.backtrack_count,
            "time_taken": end_time - start_time,
            "steps": self.steps
        }

    def _find_empty(self):
        """
        Finds the next empty cell in the grid (sequential search).
        """
        for i in range(self.grid_size):
            for j in range(self.grid_size):
                if self.grid[i][j] is None:
                    return (i, j)
        return None

    def _backtrack(self):
        """
        Recursive backtracking algorithm with step-by-step reporting.
        """
        find = self._find_empty()
        if not find:
            return True
        else:
            row, col = find

        # Log variable selection
        self.steps.append({
            "step": "Variable Selection",
            "position": {"row": row, "col": col},
            "grid": [row[:] for row in self.grid]
        })

        for num in range(1, self.grid_size + 1):
            # Log value selection
            self.steps.append({
                "step": "Value Selection",
                "position": {"row": row, "col": col},
                "value": num,
                "grid": [row[:] for row in self.grid]
            })

            if is_valid(self.grid, row, col, num, self.constraints, self.grid_size):
                self.grid[row][col] = num

                if self._backtrack():
                    return True

                # Backtrack
                self.backtrack_count += 1
                self.grid[row][col] = None
                self.steps.append({
                    "step": "Backtrack",
                    "position": {"row": row, "col": col},
                    "value": num,
                    "backtrack_count": self.backtrack_count,
                    "grid": [row[:] for row in self.grid]
                })

        return False
    

if __name__ == "__main__":
    # Example usage
    grid = [
        [None, None, 1],
        [None, None, None],
        [1, None, None]
    ]
    constraints = [
        {
            "direction": "horizontal",
            "position1": {"row": 0, "col": 0},
            "position2": {"row": 0, "col": 1},
            "type": "greater"
        },
        {
            "direction": "vertical",
            "position1": {"row": 1, "col": 1},
            "position2": {"row": 2, "col": 1},
            "type": "less"
        }
    ]
    grid_size = 3

    solver = SimpleSolver(grid, constraints, grid_size)
    result = solver.solve()
    print("Solution:", result["solution"])
    print("="* 40)
    print("Backtracks:", result["backtracks"])
    print("="* 40)
    print("Time taken:", result["time_taken"])
    print("="* 40)
    print("Steps:")
    for idx, step in enumerate(result["steps"], 1):
        print(f"Step {idx}:")
        print(f"  Action: {step['step']}")
        print(f"  Position: (row={step['position']['row']}, col={step['position']['col']})")
        if "value" in step:
            print(f"  Value: {step['value']}")
        if "backtrack_count" in step:
            print(f"  Backtrack Count: {step['backtrack_count']}")
        print("  Grid:")
        for row in step["grid"]:
            print("   ", row)
        print("-" * 30)
