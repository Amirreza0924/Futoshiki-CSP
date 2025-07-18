import React, { useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFutoshikiStore, useTimelineStore } from "../store";
import { Pause, Play, SkipForward, RotateCcw } from "lucide-react";

const SolutionSteps: React.FC = () => {
  const {
    isPlaying,
    setIsPlaying,
    setPlaySpeed,
    playSpeed,
    currentStepIndex,
    setCurrentStepIndex,
    skipToEnd,
    reset,
  } = useTimelineStore();

  const { solutionData, updateGridValue } = useFutoshikiStore();

  // Local interval management
  const intervalRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Animation logic
  useEffect(() => {
    if (!solutionData || !solutionData.steps.length) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const nextIndex = currentStepIndex + 1;

        if (nextIndex >= solutionData.steps.length) {
          setIsPlaying(false);
          return;
        }

        setCurrentStepIndex(nextIndex);

        // Update the grid based on the current step
        const currentStep = solutionData.steps[nextIndex];
        if (currentStep.grid) {
          currentStep.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
              if (cell !== null) {
                updateGridValue(rowIndex, colIndex, cell.toString());
              }
            });
          });
        }
      }, playSpeed);
    }
  }, [
    isPlaying,
    playSpeed,
    solutionData,
    currentStepIndex,
    setCurrentStepIndex,
    setIsPlaying,
    updateGridValue,
  ]);

  // Handle skip to end
  const handleSkipToEnd = () => {
    if (!solutionData) return;

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    skipToEnd();
    setCurrentStepIndex(solutionData.steps.length - 1);

    // Apply the final solution
    if (solutionData.solution) {
      solutionData.solution.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          updateGridValue(rowIndex, colIndex, cell.toString());
        });
      });
    }
  };

  // Handle reset
  const handleReset = () => {
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    reset(); // Reset the timeline

    // Reset the grid to the initial state
    if (solutionData && solutionData.steps.length > 0) {
      const initialStep = solutionData.steps[0];
      if (initialStep.grid) {
        initialStep.grid.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            updateGridValue(rowIndex, colIndex, cell ? cell.toString() : "");
          });
        });
      }
    }
  };

  const handlePlayPause = () => {
    // Reset the grid to default values that user has entered
    if (
      solutionData &&
      solutionData.steps.length > 0 &&
      currentStepIndex === 0 // If user has not started playing yet
    ) {
      const initialStep = solutionData.steps[0];
      if (initialStep.grid) {
        initialStep.grid.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            updateGridValue(rowIndex, colIndex, cell ? cell.toString() : "");
          });
        });
      }
    }

    setIsPlaying(!isPlaying);
  };

  if (!solutionData) return null;

  const speedOptions = [
    { value: 1000, label: "0.5x" },
    { value: 500, label: "1x" },
    { value: 250, label: "2x" },
    { value: 125, label: "4x" },
    { value: 50, label: "10x" },
  ];

  return (
    <>
      {/* Desktop/Tablet Version - Hidden on mobile */}
      <div className='hidden md:block bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
        <h3 className='text-lg font-semibold mb-4 text-gray-800'>
          Solution Timeline
        </h3>

        {/* Progress indicator */}
        <div className='mb-4'>
          <div className='flex justify-between text-sm text-gray-600 mb-2'>
            <span>
              Step {currentStepIndex + 1} of {solutionData.steps.length}
            </span>
            <span>
              {Math.round(
                ((currentStepIndex + 1) / solutionData.steps.length) * 100
              )}
              %
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-indigo-600 h-2 rounded-full transition-all duration-300'
              style={{
                width: `${
                  ((currentStepIndex + 1) / solutionData.steps.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Current step info */}
        <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
          <p className='text-sm font-medium text-gray-700'>
            {solutionData.steps[currentStepIndex]?.step || "Ready to start"}
          </p>
          {solutionData.steps[currentStepIndex]?.position && (
            <p className='text-xs text-gray-500 mt-1'>
              Position: ({solutionData.steps[currentStepIndex].position.row + 1}
              , {solutionData.steps[currentStepIndex].position.col + 1})
              {solutionData.steps[currentStepIndex]?.value &&
                ` • Value: ${solutionData.steps[currentStepIndex].value}`}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className='flex items-center justify-center gap-3 mb-4'>
          <button
            onClick={handleReset}
            className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer'
            title='Reset to beginning'
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={handlePlayPause}
            className='p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer'
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={handleSkipToEnd}
            className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer'
            title='Skip to end'
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Speed control */}
        <div className='flex items-center justify-center gap-2'>
          <span className='text-sm text-gray-600'>Speed:</span>
          <div className='flex gap-1'>
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPlaySpeed(option.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  playSpeed === option.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version - Compact bottom overlay */}
      <AnimatePresence>
        <motion.div
          className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 mb-0'
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 150 }}
          transition={{
            type: "spring",
            damping: 55,
            stiffness: 333,
            duration: 1,
          }}
        >
          {/* Mobile Progress Bar */}
          <div className='absolute top-0 left-0 right-0 h-1 bg-gray-200'>
            <motion.div
              className='h-full bg-indigo-600'
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((currentStepIndex + 1) / solutionData.steps.length) * 100
                }%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className='p-4'>
            {/* Step counter */}
            <div className='text-center mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Step {currentStepIndex + 1} of {solutionData.steps.length}
              </span>
              <span className='text-xs text-gray-500 ml-2'>
                (
                {Math.round(
                  ((currentStepIndex + 1) / solutionData.steps.length) * 100
                )}
                %)
              </span>
            </div>

            {/* Mobile Controls */}
            <div className='flex items-center justify-center gap-4 mb-3'>
              <button
                onClick={handleReset}
                className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                title='Reset'
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={handlePlayPause}
                className='p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors'
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <button
                onClick={handleSkipToEnd}
                className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                title='Skip to end'
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Mobile Speed Control - Compact */}
            <div className='flex items-center justify-center gap-1'>
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPlaySpeed(option.value)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    playSpeed === option.value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default memo(SolutionSteps);
