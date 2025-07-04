import "./App.css";
import React, { useEffect } from "react";
import { useFutoshikiStore } from "./store/futoshikiStore";
import { solvePuzzle } from "./utils/puzzleSolver";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import PuzzleGrid from "./components/PuzzleGrid";
import Sidebar from "./components/Sidebar";
import { Toaster } from "sonner";

const App: React.FC = () => {
  const {
    gridSize,
    grid,
    constraints,
    solverType,
    setCurrentStep,
    setIsAnimating,
    setApiResponse,
    updateGridValue,
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

      setApiResponse(result);
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          updateGridValue(i, j, result.solution.solution[i][j].toString());
        }
      }
      setCurrentStep("solved");
      document.getElementById("puzzle-grid")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } catch (error) {
      setCurrentStep("setup");
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative'>
      <Toaster richColors position='top-center' />

      <div className='container mx-auto px-2 md:px-4 py-8 pb-32 md:pb-8'>
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
