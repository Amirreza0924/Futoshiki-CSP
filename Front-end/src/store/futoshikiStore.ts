import { create } from "zustand";

export interface Constraint {
  type: "greater" | "less";
  position1: { row: number; col: number };
  position2: { row: number; col: number };
  direction: "horizontal" | "vertical";
}

export interface SolutionStep {
  step: string;
  position: { row: number; col: number };
  value?: number;
  domain_size?: number;
  grid: (number | null)[][];
}

export interface SolutionData {
  solution: number[][];
  backtracks: number;
  time_taken: number;
  steps: SolutionStep[];
}

export interface ApiResponse {
  message: string;
  solution: SolutionData;
}

export type CurrentStep = "setup" | "solving" | "solved";
export type SolverType = "basic" | "optimized";

interface FutoshikiState {
  // Grid state
  gridSize: number;
  grid: (number | null)[][];
  constraints: Constraint[];
  solution: number[][] | null;

  // Solution state
  solutionData: SolutionData | null;
  currentStepIndex: number;

  // UI state
  currentStep: CurrentStep;
  isAnimating: boolean;
  solverType: SolverType;
  showSteps: boolean;

  // Actions
  setGridSize: (size: number) => void;
  updateGridValue: (row: number, col: number, value: string) => void;
  addConstraint: (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
    type: "greater" | "less"
  ) => void;
  removeConstraint: (constraint: Constraint) => void;
  getConstraintBetween: (
    row1: number,
    col1: number,
    row2: number,
    col2: number
  ) => Constraint | undefined;
  setSolution: (solution: number[][]) => void;
  setSolutionData: (data: SolutionData) => void;
  setApiResponse: (response: ApiResponse) => void;
  setCurrentStep: (step: CurrentStep) => void;
  setIsAnimating: (animating: boolean) => void;
  setSolverType: (type: SolverType) => void;
  setShowSteps: (show: boolean) => void;
  resetPuzzle: () => void;
  initializeGrid: (size: number) => void;
}

export const useFutoshikiStore = create<FutoshikiState>((set, get) => ({
  // Initial state
  gridSize: 4,
  grid: [],
  constraints: [],
  solution: null,
  solutionData: null,
  currentStepIndex: 0,
  currentStep: "setup",
  isAnimating: false,
  solverType: "optimized",
  showSteps: false,

  // Actions
  setGridSize: (size: number) => {
    set({ gridSize: size });
    get().initializeGrid(size);
  },

  initializeGrid: (size: number) => {
    const newGrid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    set({
      grid: newGrid,
      constraints: [],
      solution: null,
      solutionData: null,
      currentStep: "setup",
      currentStepIndex: 0,
    });
  },

  updateGridValue: (row: number, col: number, value: string) => {
    const { grid, gridSize } = get();
    const numValue = value === "" ? null : parseInt(value);
    if (numValue && (numValue < 1 || numValue > gridSize)) return;

    const newGrid = [...grid];
    newGrid[row][col] = numValue;
    set({ grid: newGrid });
  },

  addConstraint: (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
    type: "greater" | "less"
  ) => {
    const { constraints } = get();
    const direction = row1 === row2 ? "horizontal" : "vertical";
    const newConstraint: Constraint = {
      type,
      position1: { row: row1, col: col1 },
      position2: { row: row2, col: col2 },
      direction,
    };

    // Remove existing constraint between these positions
    const filteredConstraints = constraints.filter(
      (c) =>
        !(
          c.position1.row === row1 &&
          c.position1.col === col1 &&
          c.position2.row === row2 &&
          c.position2.col === col2
        ) &&
        !(
          c.position1.row === row2 &&
          c.position1.col === col2 &&
          c.position2.row === row1 &&
          c.position2.col === col1
        )
    );

    set({ constraints: [...filteredConstraints, newConstraint] });
  },

  removeConstraint: (constraint: Constraint) => {
    const { constraints } = get();
    set({ constraints: constraints.filter((c) => c !== constraint) });
  },

  getConstraintBetween: (
    row1: number,
    col1: number,
    row2: number,
    col2: number
  ) => {
    const { constraints } = get();
    return constraints.find(
      (c) =>
        (c.position1.row === row1 &&
          c.position1.col === col1 &&
          c.position2.row === row2 &&
          c.position2.col === col2) ||
        (c.position1.row === row2 &&
          c.position1.col === col2 &&
          c.position2.row === row1 &&
          c.position2.col === col1)
    );
  },

  setSolution: (solution: number[][]) => set({ solution }),
  setSolutionData: (data: SolutionData) => {
    set({ 
      solutionData: data,
      solution: data.solution
    });
  },
  setApiResponse: (response: ApiResponse) => {
    set({ 
      solutionData: response.solution,
      solution: response.solution.solution
    });
  },
  setCurrentStep: (step: CurrentStep) => set({ currentStep: step }),
  setIsAnimating: (animating: boolean) => set({ isAnimating: animating }),
  setSolverType: (type: SolverType) => set({ solverType: type }),
  setShowSteps: (show: boolean) => set({ showSteps: show }),

  resetPuzzle: () => {
    const { gridSize } = get();
    get().initializeGrid(gridSize);
  },
}));
