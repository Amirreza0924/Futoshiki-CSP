import { memo } from "react";

const Header: React.FC = () => {
  return (
    <div className='text-center mb-8'>
      <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
        Futoshiki Solver
      </h1>
      <p className='text-gray-600'>
        Intelligent Constraint Satisfaction Problem Solver
      </p>
    </div>
  );
};

export default memo(Header);
