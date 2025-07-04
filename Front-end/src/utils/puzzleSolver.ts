import axios from "axios";
import { type Constraint, type ApiResponse } from "../store/futoshikiStore";

export interface SolvePuzzleParams {
  grid: (number | null)[][];
  constraints: Constraint[];
  gridSize: number;
  solverType: "basic" | "optimized";
}

export const solvePuzzle = async (
  params: SolvePuzzleParams
): Promise<ApiResponse> => {
  const { grid, constraints, gridSize, solverType } = params;

  // POST API response structure
  console.log("\x1b[34m%s\x1b[0m", "POST API response structure:");
  console.log("\x1b[32m%s\x1b[0m", "Grid:", grid);
  console.log("\x1b[32m%s\x1b[0m", "Constraints:", constraints);
  console.log("\x1b[32m%s\x1b[0m", "Grid Size:", gridSize);
  console.log("\x1b[32m%s\x1b[0m", "Solver Type:", solverType);

  try {
    const response = await axios.post("http://127.0.0.1:8000/solve", {
      Grid: grid,
      Constraints: constraints,
      GridSize: gridSize,
      SolverType: solverType,
    });

    console.log(response.data);
    return response.data as ApiResponse;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
