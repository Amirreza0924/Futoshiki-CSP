import React from "react";
import { Brain, ChevronRight, ChevronDown } from "lucide-react";
import { useFutoshikiStore } from "../store/futoshikiStore";

const SolutionSteps: React.FC = () => {
  const { solutionSteps, showSteps, setShowSteps } = useFutoshikiStore();

  if (solutionSteps.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
      <div
        className='p-4 cursor-pointer flex items-center justify-between'
        onClick={() => setShowSteps(!showSteps)}
      >
        <h3 className='text-lg font-semibold flex items-center gap-2'>
          <Brain size={18} className='text-purple-600' />
          Solution Steps
        </h3>
        {showSteps ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>

      {showSteps && (
        <div className='px-4 pb-4 max-h-96 overflow-y-auto'>
          <div className='space-y-2'>
            {solutionSteps.map((step, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 text-sm ${
                  step.stepType === "assignment"
                    ? "bg-green-50 border-green-400"
                    : step.stepType === "backtrack"
                    ? "bg-red-50 border-red-400"
                    : step.stepType === "constraint_propagation"
                    ? "bg-blue-50 border-blue-400"
                    : "bg-purple-50 border-purple-400"
                }`}
              >
                <div className='font-medium capitalize mb-1'>
                  {step.stepType.replace("_", " ")}
                </div>
                <div className='text-gray-700'>{step.description}</div>
                {step.position && (
                  <div className='text-xs text-gray-500 mt-1'>
                    Position: ({step.position.row}, {step.position.col})
                    {step.value && ` → ${step.value}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionSteps;
