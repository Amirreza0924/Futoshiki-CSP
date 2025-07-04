import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings } from "lucide-react";
import { useFutoshikiStore } from "../store/futoshikiStore";
import { useTimelineStore } from "../store/timeline";
import ConstraintButton from "./ConstraintButton";

const PuzzleGrid: React.FC = () => {
  const {
    grid,
    gridSize,
    currentStep,
    solution,
    updateGridValue,
    solutionData,
  } = useFutoshikiStore();
  const { isPlaying, currentStepIndex } = useTimelineStore();

  // Get the current step position for highlighting
  const currentStepPosition = solutionData?.steps[currentStepIndex]?.position;

  // Check if a cell is the current step position
  const isCurrentStepCell = (row: number, col: number) => {
    return currentStepPosition?.row === row && currentStepPosition?.col === col;
  };

  // Custom spring transition
  const springTransition = {
    type: "spring" as const,
    damping: 20,
    stiffness: 300,
    mass: 0.8,
  };

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
                    <motion.div
                      layout
                      className='relative size-12'
                      whileHover={!isPlaying ? { scale: 1.05 } : undefined}
                      whileTap={!isPlaying ? { scale: 0.95 } : undefined}
                      animate={
                        isCurrentStepCell(rowIndex, colIndex)
                          ? { scale: 1.1 }
                          : { scale: 1 }
                      }
                      transition={springTransition}
                    >
                      <motion.input
                        type='text'
                        value={cell || ""}
                        onChange={(e) =>
                          updateGridValue(rowIndex, colIndex, e.target.value)
                        }
                        className='size-12 text-center text-lg font-semibold border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        maxLength={1}
                        disabled={currentStep !== "setup"}
                        animate={{
                          borderColor: isCurrentStepCell(rowIndex, colIndex)
                            ? "#4f46e5"
                            : "#d1d5db",
                          backgroundColor:
                            solution &&
                            solution[rowIndex][colIndex] !==
                              grid[rowIndex][colIndex]
                              ? "#fef3c7"
                              : isCurrentStepCell(rowIndex, colIndex)
                              ? "#f0f9ff"
                              : "#ffffff",
                          boxShadow: isCurrentStepCell(rowIndex, colIndex)
                            ? "0 0 0 3px rgba(79, 70, 229, 0.3)"
                            : "0 0 0 0px rgba(0, 0, 0, 0)",
                        }}
                        transition={{
                          type: "spring",
                          duration: 0.65,
                          bounce: 0.3,
                        }}
                      />

                      {/* Animated value display */}
                      <AnimatePresence mode='wait'>
                        {cell && (
                          <motion.div
                            key={`${rowIndex}-${colIndex}-${cell}`}
                            initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0, opacity: 0, rotateY: -90 }}
                            transition={{
                              type: "spring",
                              duration: 0.4,
                              bounce: 0.3,
                            }}
                            className='absolute inset-0 flex items-center justify-center pointer-events-none'
                          >
                            <motion.span
                              initial={{ y: -10 }}
                              animate={{ y: 0 }}
                              className='text-lg font-bold text-indigo-600'
                            >
                              {cell}
                            </motion.span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Current step highlight */}
                      {isCurrentStepCell(rowIndex, colIndex) && (
                        <motion.div
                          className='absolute inset-0 rounded-lg'
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [0.95, 1.05, 0.95],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            background:
                              "radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.1) 70%, transparent 100%)",
                          }}
                        />
                      )}

                      {/* Pulse effect for playing state */}
                      {isPlaying && (
                        <motion.div
                          className='absolute inset-0 rounded-lg border border-indigo-300'
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: [0, 0.4, 0],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.div>

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

        <motion.div
          className='mt-4 text-sm text-gray-600'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>
      </div>
    </div>
  );
};

export default PuzzleGrid;
