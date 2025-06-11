import "./App.css";
import React, { useEffect } from "react";
import { useFutoshikiStore } from "./store/futoshikiStore";
import { solvePuzzle } from "./utils/puzzleSolver";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import PuzzleGrid from "./components/PuzzleGrid";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const {
    gridSize,
    grid,
    constraints,
    solverType,
    setCurrentStep,
    setIsAnimating,
    setSolution,
    setSolutionSteps,
    initializeGrid,
  } = useFutoshikiStore();

  // Initialize grid when component mounts
  useEffect(() => {
    initializeGrid(gridSize);
  }, []);

  const handleSolvePuzzle = async () => {
    try {
      setCurrentStep("solving");
      setIsAnimating(true);

      const result = await solvePuzzle({
        grid,
        constraints,
        gridSize,
        solverType,
      });

      setSolution(result.solution);
      setSolutionSteps(result.steps);
      setCurrentStep("solved");
    } catch (error) {
      console.error("Failed to solve puzzle:", error);
      setCurrentStep("setup");
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative'>
      <div className='container mx-auto px-2 md:px-4 py-8'>
        <Header />
        <ControlPanel onSolvePuzzle={handleSolvePuzzle} />

        {/* Main Content */}
        <div className='max-w-6xl mx-auto grid lg:grid-cols-3 gap-8'>
          <PuzzleGrid />
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default App;
