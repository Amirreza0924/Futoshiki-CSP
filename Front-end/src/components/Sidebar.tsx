import React from "react";
import Statistics from "./Statistics";
import SolutionSteps from "./SolutionSteps";

const Sidebar: React.FC = () => {
  return (
    <div className='space-y-6'>
      <SolutionSteps />
      <Statistics />
    </div>
  );
};

export default Sidebar;
