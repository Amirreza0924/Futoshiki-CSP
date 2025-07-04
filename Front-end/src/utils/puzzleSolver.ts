import axios from "axios";
import { type Constraint, type ApiResponse } from "../store/futoshikiStore";
import { toast } from "sonner";

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

  try {
    const response = await axios.post("http://127.0.0.1:8000/solve", {
      Grid: grid,
      Constraints: constraints,
      GridSize: gridSize,
      SolverType: solverType,
    });

    return response.data as ApiResponse;
  } catch (error: any) {
    toast.error(error.response.data.detail.error);
    throw error;
  }
};
