import React from "react";
import { Zap } from "lucide-react";
import { useFutoshikiStore } from "../store/futoshikiStore";

const Statistics: React.FC = () => {
  const { currentStep, solverType, solutionData } = useFutoshikiStore();

  if (currentStep !== "solved") return null;

  console.log(solutionData);

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
      <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
        <Zap size={18} className='text-yellow-600' />
        Solution Statistics
      </h3>
      <div className='space-y-3'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Solver Type:</span>
          <span className='font-medium capitalize'>{solverType}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Algorithm Steps:</span>
          <span className='font-medium'>{solutionData?.steps.length || 0}</span>
        </div>
        {solutionData && (
          <>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Backtracks:</span>
              <span className='font-medium'>{solutionData.backtracks}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Time Taken:</span>
              <span className='font-medium'>
                {solutionData.time_taken.toFixed(6)} ms
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;
