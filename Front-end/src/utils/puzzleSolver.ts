import { type Constraint, type SolutionStep } from "../store/futoshikiStore";

export interface SolvePuzzleParams {
  grid: (number | null)[][];
  constraints: Constraint[];
  gridSize: number;
  solverType: "basic" | "optimized";
}

export interface SolvePuzzleResult {
  solution: number[][];
  steps: SolutionStep[];
  statistics: {
    backtracks: number;
    time: number;
    stepCount: number;
  };
}

export const solvePuzzle = async (
  params: SolvePuzzleParams
): Promise<SolvePuzzleResult> => {
  const { grid, constraints, gridSize, solverType } = params;

  console.log("Solving with constraints:", constraints);
  console.table(grid);

  // Mock API call - replace with actual FastAPI call
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock solution data
  const mockSolution = Array(gridSize)
    .fill(null)
    .map((_, row) =>
      Array(gridSize)
        .fill(null)
        .map((_, col) => ((row * gridSize + col) % gridSize) + 1)
    );

  const mockSteps: SolutionStep[] = [
    {
      stepType: "assignment",
      position: { row: 0, col: 0 },
      value: 1,
      description: "Assigned value 1 to cell (0,0) using MRV heuristic",
    },
    {
      stepType: "constraint_propagation",
      description: "Applied AC-2 algorithm to propagate constraints",
    },
    {
      stepType: "assignment",
      position: { row: 0, col: 1 },
      value: 2,
      description: "Assigned value 2 to cell (0,1)",
    },
    {
      stepType: "backtrack",
      description: "Detected conflict, backtracking...",
    },
    {
      stepType: "assignment",
      position: { row: 0, col: 1 },
      value: 3,
      description: "Reassigned value 3 to cell (0,1)",
    },
  ];

  const mockStatistics = {
    backtracks: 12,
    time: 0.45,
    stepCount: mockSteps.length,
  };

  return {
    solution: mockSolution,
    steps: mockSteps,
    statistics: mockStatistics,
  };
};
