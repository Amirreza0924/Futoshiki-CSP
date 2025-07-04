import React from "react";
import { useFutoshikiStore } from "../store/futoshikiStore";

const SolutionSteps: React.FC = () => {
  const { solutionData, showSteps, setShowSteps } = useFutoshikiStore();

  if (!solutionData || solutionData.steps.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>Solution Steps</h3>
        <button
          onClick={() => setShowSteps(!showSteps)}
          className='text-blue-600 hover:text-blue-800 text-sm font-medium'
        >
          {showSteps ? "Hide Steps" : "Show Steps"}
        </button>
      </div>

      {showSteps && (
        <div className='space-y-3 max-h-96 overflow-y-auto'>
          {solutionData.steps.map((step, index) => (
            <div
              key={index}
              className='bg-gray-50 rounded-lg p-3 border border-gray-200'
            >
              <div className='flex justify-between items-start mb-2'>
                <span className='font-medium text-sm text-gray-800'>
                  Step {index + 1}: {step.step}
                </span>
                <span className='text-xs text-gray-500'>
                  ({step.position.row}, {step.position.col})
                </span>
              </div>
              <div className='text-sm text-gray-600 space-y-1'>
                {step.value !== undefined && <div>Value: {step.value}</div>}
                {step.domain_size !== undefined && (
                  <div>Domain Size: {step.domain_size}</div>
                )}
                <div className='text-xs text-gray-500 mt-2'>
                  Grid state at this step available
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolutionSteps;
