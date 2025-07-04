import React, { useEffect, useRef } from "react";
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

  const { solutionData, updateGridValue, resetPuzzle } = useFutoshikiStore();

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
    resetPuzzle(); // Reset the puzzle

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

  if (!solutionData) return null;

  const speedOptions = [
    { value: 1000, label: "0.5x" },
    { value: 500, label: "1x" },
    { value: 250, label: "2x" },
    { value: 125, label: "4x" },
    { value: 50, label: "10x" },
  ];

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
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
            Position: ({solutionData.steps[currentStepIndex].position.row + 1},{" "}
            {solutionData.steps[currentStepIndex].position.col + 1})
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
          onClick={() => {
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
                    updateGridValue(
                      rowIndex,
                      colIndex,
                      cell ? cell.toString() : ""
                    );
                  });
                });
              }
            }

            setIsPlaying(!isPlaying);
          }}
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
  );
};

export default SolutionSteps;
