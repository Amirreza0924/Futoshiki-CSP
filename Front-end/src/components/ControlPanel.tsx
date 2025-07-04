import React, { memo } from "react";
import { RotateCcw, Brain } from "lucide-react";
import { useFutoshikiStore } from "../store/futoshikiStore";
import { useTimelineStore } from "../store";

interface ControlPanelProps {
  onSolvePuzzle: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onSolvePuzzle }) => {
  const {
    gridSize,
    currentStep,
    isAnimating,
    solverType,
    setGridSize,
    setSolverType,
    resetPuzzle,
  } = useFutoshikiStore();

  const { reset } = useTimelineStore();
  return (
    <div className='max-w-4xl mx-auto mb-8'>
      <div className='bg-white rounded-2xl shadow-lg md:p-6 p-4 border border-gray-100'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 justify-items-center items-center gap-4 w-full'>
            <div className='flex items-center gap-3'>
              <label className='md:text-sm text-xs font-medium text-gray-700 whitespace-nowrap'>
                Grid Size:
              </label>
              <div className='custom-select'>
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  disabled={currentStep !== "setup"}
                >
                  <option value={3}>3×3 Grid</option>
                  <option value={4}>4×4 Grid</option>
                  <option className='hidden md:block' value={5}>
                    5×5 Grid
                  </option>
                  <option className='hidden md:block' value={6}>
                    6×6 Grid
                  </option>
                  <option className='hidden md:block' value={7}>
                    7×7 Grid
                  </option>
                  <option className='hidden md:block' value={8}>
                    8×8 Grid
                  </option>

                  <option
                    className='text-xs text-gray-500 block md:hidden'
                    disabled
                    value=''
                  >
                    For bigger grids, use a desktop
                  </option>
                </select>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <label className='md:text-sm text-xs font-medium text-gray-700 whitespace-nowrap'>
                Algorithm:
              </label>
              <div className='custom-select'>
                <select
                  disabled={currentStep === "solved"}
                  value={solverType}
                  onChange={(e) =>
                    setSolverType(e.target.value as "basic" | "optimized")
                  }
                >
                  <option value='basic'>Basic Backtrack</option>
                  <option value='optimized'>Smart CSP Solver</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reset and Solve Buttons */}
          <div className='flex items-center justify-around md:justify-center gap-x-4 w-full'>
            <button
              onClick={() => {
                resetPuzzle();
                reset();
              }}
              className='flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              onClick={onSolvePuzzle}
              disabled={currentStep === "solving" || isAnimating}
              className='flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              {currentStep === "solving" ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
                  Solving...
                </>
              ) : (
                <>
                  <Brain size={16} />
                  Solve Puzzle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ControlPanel);
