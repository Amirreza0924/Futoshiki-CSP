import React from "react";
import { useFutoshikiStore, type Constraint } from "../store/futoshikiStore";

interface ConstraintButtonProps {
  row1: number;
  col1: number;
  row2: number;
  col2: number;
  isHorizontal: boolean;
}

const ConstraintButton: React.FC<ConstraintButtonProps> = ({
  row1,
  col1,
  row2,
  col2,
  isHorizontal,
}) => {
  const { getConstraintBetween, addConstraint, removeConstraint } =
    useFutoshikiStore();

  const constraint = getConstraintBetween(row1, col1, row2, col2);
  const symbol = constraint ? (constraint.type === "greater" ? ">" : "<") : "";

  const handleClick = () => {
    if (!constraint) {
      // State 1: none -> greater
      addConstraint(row1, col1, row2, col2, "greater");
    } else if (constraint.type === "greater") {
      // State 2: greater -> less
      addConstraint(row1, col1, row2, col2, "less");
    } else {
      // State 3: less -> none (remove constraint)
      removeConstraint(constraint);
    }
  };

  return (
    <button
      className={`constraint-btn ${isHorizontal ? "horizontal" : "vertical"} ${
        constraint ? "active" : ""
      }`}
      onClick={handleClick}
    >
      <span className='constraint-symbol'>{symbol}</span>
    </button>
  );
};

export default ConstraintButton;
