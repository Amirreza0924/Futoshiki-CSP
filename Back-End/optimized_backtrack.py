# optimized_backtrack.py
import time
from collections import deque
from utils import get_neighbors

class OptimizedSolver:
    def __init__(self, grid, constraints, grid_size):
        self.grid = [row[:] for row in grid]
        self.constraints = constraints
        self.grid_size = grid_size
        self.backtrack_count = 0
        self.steps = []
        
        # Initialize domains for each cell
        self.domains = {}
        for r in range(grid_size):
            for c in range(grid_size):
                if self.grid[r][c] is None:
                    self.domains[(r, c)] = list(range(1, self.grid_size + 1))
                else:
                    self.domains[(r, c)] = [self.grid[r][c]]

    def solve(self):
        """
        Public method to start the solving process.
        """
        start_time = time.time()

        # 1. Pre-processing with AC-2
        self.ac2_initial()
        
        solution_found = self._backtrack()
        end_time = time.time()

        # Add final step to steps
        self.steps.append({
            "step": "Final Grid",
            "position": None,
            "grid": [row[:] for row in self.grid]
        })

        return {
            "solution": self.grid if solution_found else None,
            "backtracks": self.backtrack_count,
            "time_taken": end_time - start_time,
            "steps": self.steps
        }

    def _is_consistent(self, var, value, assignment):
        """Check if a value is consistent with the assignment."""
        r, c = var
        # Check row and column constraints
        for i in range(self.grid_size):
            if (r, i) in assignment and assignment[(r, i)] == value:
                return False
            if (i, c) in assignment and assignment[(i, c)] == value:
                return False

        # Check inequality constraints
        for const in self.constraints:
            p1 = (const.position1.row, const.position1.col)
            p2 = (const.position2.row, const.position2.col)

            if p1 == var and p2 in assignment:
                if const.type == 'greater' and value <= assignment[p2]:
                    return False
                if const.type == 'less' and value >= assignment[p2]:
                    return False
            elif p2 == var and p1 in assignment:
                if const.type == 'greater' and assignment[p1] <= value:
                    return False
                if const.type == 'less' and assignment[p1] >= value:
                    return False
        return True

    # --- Heuristics: MRV and LCV ---
    def _select_unassigned_variable_mrv(self, assignment):
        """Selects the unassigned variable with the Minimum Remaining Values (MRV)."""
        unassigned = [v for v in self.domains if v not in assignment]
        return min(unassigned, key=lambda var: len(self.domains[var]))

    def _order_domain_values_lcv(self, var, assignment):
        """Orders values in the domain of a variable using Least Constraining Value (LCV)."""
        def count_conflicts(value):
            conflicts = 0
            neighbors = get_neighbors(var[0], var[1], self.grid_size)
            for neighbor in neighbors:
                if neighbor not in assignment and value in self.domains[neighbor]:
                    conflicts += 1
            return conflicts
        
        return sorted(self.domains[var], key=count_conflicts)

    # --- Inference: Forward Checking and AC-2 ---
    def _forward_checking(self, var, value, assignment):
        """Performs forward checking."""
        inferences = {}
        neighbors = get_neighbors(var[0], var[1], self.grid_size)

        for neighbor in neighbors:
            if neighbor not in assignment:
                if value in self.domains[neighbor]:
                    if neighbor not in inferences:
                         inferences[neighbor] = self.domains[neighbor][:]
                    
                    self.domains[neighbor].remove(value)
                    
                    if not self.domains[neighbor]:
                        return None # Failure
        return inferences


    def ac2_initial(self):
        """Initial AC-2 run for pre-processing."""
        queue = deque()
        # Add all arcs to the queue initially
        for var1 in self.domains:
            for neighbor in get_neighbors(var1[0], var1[1], self.grid_size):
                queue.append((var1, neighbor))

        self.ac2(queue)

    def ac2(self, queue):
        """AC-2 algorithm to enforce arc consistency."""
        while queue:
            (xi, xj) = queue.popleft()
            if self._revise(xi, xj):
                if not self.domains[xi]:
                    return False  # Inconsistency found
                
                # AC-2 specific: Add only arcs (xk, xi) to the queue.
                for xk in get_neighbors(xi[0], xi[1], self.grid_size):
                    if xk != xj:
                        queue.append((xk, xi))
        return True

    def _revise(self, xi, xj):
        """Helper for AC-2. Returns true if we revise the domain of xi."""
        revised = False
        for x in self.domains[xi][:]:
            # Check if there is a value y in the domain of xj that satisfies the constraint with x
            satisfies = any(self._is_consistent(xi, x, {xj: y}) for y in self.domains[xj])
            if not satisfies:
                self.domains[xi].remove(x)
                revised = True
        return revised


    # --- Main Backtracking Algorithm ---
    def _backtrack(self, assignment={}):
        """Optimized recursive backtracking algorithm."""
        if len(assignment) == self.grid_size * self.grid_size:
            return True

        var = self._select_unassigned_variable_mrv(assignment)
        self.steps.append({
            "step": "Variable Selection (MRV)",
            "position": {"row": var[0], "col": var[1]},
            "domain_size": len(self.domains[var]),
            "grid": [row[:] for row in self.grid]
        })

        ordered_values = self._order_domain_values_lcv(var, assignment)

        for value in ordered_values:
            if self._is_consistent(var, value, assignment):
                self.steps.append({
                    "step": "Value Selection (LCV)",
                    "position": {"row": var[0], "col": var[1]},
                    "value": value,
                    "grid": [row[:] for row in self.grid]
                })
                
                assignment[var] = value
                self.grid[var[0]][var[1]] = value
                
                original_domains = {key: val[:] for key, val in self.domains.items()}
                
                # Forward checking
                if self._forward_checking(var, value, assignment) is not None:
                    # AC-2 propagation
                    queue = deque([(neighbor, var) for neighbor in get_neighbors(var[0], var[1], self.grid_size) if neighbor not in assignment])
                    if self.ac2(queue):
                        result = self._backtrack(assignment)
                        if result:
                            return True
                
                # Restore domains on failure
                self.domains = original_domains

        # Backtrack
        if var in assignment:
            del assignment[var]
            self.grid[var[0]][var[1]] = None
            self.backtrack_count += 1
            self.steps.append({
                "step": "Backtrack",
                "position": {"row": var[0], "col": var[1]},
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

    solver = OptimizedSolver(grid, constraints, grid_size)
    result = solver.solve()
    print("Solution:")
    for row in result["solution"]:
            print("   ", row)
    print("="* 40)
    print("Backtracks:", result["backtracks"])
    print("="* 40)
    print("Time taken:", int(result["time_taken"] * (10**6)), "microseconds")
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
