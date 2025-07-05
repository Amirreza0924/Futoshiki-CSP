# Futoshiki Puzzle Solver

This project is a Futoshiki puzzle solver with a simple and optimized backtracking algorithm. It also provides an API to solve the puzzles and compare the performance of the two algorithms.

---
## Files

### `main.py`

This file contains the main API for the project. It uses FastAPI to create the server and define the endpoints.

**Functionality:**
* It initializes a FastAPI application.
* It sets up CORS middleware to allow all origins.
* It defines a root endpoint that returns a welcome message.
* It defines a `/solve` endpoint that takes a Futoshiki problem as input and solves it using either the optimized or the basic solver, depending on the `SolverType` parameter in the request.
* It defines a `/solve-compared` endpoint that solves the same problem using both the optimized and the simple solver and returns a comparison of their performance.

**Methods:**
* `read_root()`: An asynchronous function that returns a welcome message.
* `solve_problem(problem_data: problem)`: An asynchronous function that receives the problem data, selects the appropriate solver, and returns the solution. If no solution is found, it raises an HTTPException with a 422 status code.
* `solve_problem_comparison(problem_data: problem)`: An asynchronous function that solves the problem with both solvers and returns a JSON object with the final solutions, timings, and the number of backtracks for each solver.

### `simple_backtrack.py`

This file implements a simple backtracking algorithm to solve the Futoshiki puzzle.

**Functionality:**
* It defines a `SimpleSolver` class that takes the grid, constraints, and grid size as input.
* The `solve` method starts the backtracking process and returns the solution, number of backtracks, time taken, and the steps of the process.
* It uses a recursive backtracking algorithm to explore possible solutions.
* It keeps a record of each step of the process, including variable and value selections, and backtracks.

**Methods:**
* `solve()`: The main public method that initiates the solving process. It returns a dictionary containing the solution grid (or `None` if no solution is found), the number of backtracks, the time taken, and a list of steps.
* `_find_empty()`: Finds the next empty cell in the grid.
* `_backtrack()`: The core recursive backtracking function.

### `optimized_backtrack.py`

This file implements an optimized backtracking algorithm using advanced AI techniques.

**Functionality:**
* It defines an `OptimizedSolver` class that uses techniques like **Minimum Remaining Values (MRV)** and **Least Constraining Value (LCV)** for heuristics, and **Forward Checking** and the **AC-2 algorithm** for inference.
* It initializes the domains of possible values for each cell and uses the AC-2 algorithm for pre-processing to enforce arc consistency.
* The `solve` method starts the backtracking process and returns the solution, the number of backtracks, the time taken, and the steps of the process.

**Methods:**
* `solve()`: Similar to the `SimpleSolver`, this is the main method to start the process.
* `_is_consistent(var, value, assignment)`: Checks if a value is consistent with the current assignment.
* `_select_unassigned_variable_mrv(assignment)`: Selects the next variable to assign using the MRV heuristic.
* `_order_domain_values_lcv(var, assignment)`: Orders the domain values using the LCV heuristic.
* `_forward_checking(var, value, assignment)`: Performs forward checking after a value is assigned to a variable.
* `ac2_initial()`: Runs the AC-2 algorithm for pre-processing.
* `ac2(queue)`: The AC-2 algorithm to enforce arc consistency.
* `_revise(xi, xj)`: A helper function for AC-2 that revises the domain of a variable.
* `_backtrack(assignment={})`: The main recursive backtracking function that uses the implemented optimizations.

### `utils.py`

This file provides utility functions that are used by both solvers.

**Functionality:**
* It provides a function to check the validity of placing a number in a given cell.
* It offers a function to get all the neighbors of a cell in the grid.

**Methods:**
* `is_valid(grid, row, col, num, constraints, grid_size)`: Checks if placing `num` at `(row, col)` is valid by checking for uniqueness in the row and column and satisfying all the inequality constraints.
* `get_neighbors(row, col, grid_size)`: Returns a list of all cells in the same row or column as the given cell.

### `pyproject.toml`

This file is the project's configuration file.

**Functionality:**
* It specifies the project's dependencies, which are **FastAPI** and **Uvicorn**.

