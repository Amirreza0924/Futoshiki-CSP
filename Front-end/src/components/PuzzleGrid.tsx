import React from "react";
import { Settings } from "lucide-react";
import { useFutoshikiStore } from "../store/futoshikiStore";
import ConstraintButton from "./ConstraintButton";

const PuzzleGrid: React.FC = () => {
  const { grid, gridSize, currentStep, solution, updateGridValue } =
    useFutoshikiStore();

  return (
    <div className='lg:col-span-2'>
      <div className='bg-white rounded-2xl shadow-lg md:p-6 p-4 border border-gray-100'>
        <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
          <Settings size={20} className='text-indigo-600' />
          Puzzle Setup
        </h2>

        <div className='puzzle-container'>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className='grid-row'>
              {row.map((cell, colIndex) => (
                <React.Fragment key={colIndex}>
                  <div className='cell-container'>
                    <input
                      type='text'
                      value={cell || ""}
                      onChange={(e) =>
                        updateGridValue(rowIndex, colIndex, e.target.value)
                      }
                      className='size-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                      maxLength={1}
                      disabled={currentStep !== "setup"}
                      style={{
                        backgroundColor:
                          solution &&
                          solution[rowIndex][colIndex] !==
                            grid[rowIndex][colIndex]
                            ? "#fef3c7"
                            : "white",
                      }}
                    />

                    {/* Vertical constraint below */}
                    {rowIndex < gridSize - 1 && (
                      <div className='constraint-container vertical'>
                        <ConstraintButton
                          row1={rowIndex}
                          col1={colIndex}
                          row2={rowIndex + 1}
                          col2={colIndex}
                          isHorizontal={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Horizontal constraint to the right */}
                  {colIndex < gridSize - 1 && (
                    <div className='constraint-container horizontal'>
                      <ConstraintButton
                        row1={rowIndex}
                        col1={colIndex}
                        row2={rowIndex}
                        col2={colIndex + 1}
                        isHorizontal={true}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        <div className='mt-4 text-sm text-gray-600'>
          <p>
            <strong>Instructions:</strong>
          </p>
          <ul className='list-disc list-inside space-y-1 mt-2'>
            <li>Enter numbers 1-{gridSize} in cells (optional pre-fill)</li>
            <li>
              Click between cells to add inequality constraints (&gt;, &lt;)
            </li>
            <li>Click constraint buttons to cycle through options</li>
            <li>
              Each row and column must contain all numbers 1-{gridSize} exactly
              once
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PuzzleGrid;
