import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalTrigger,
} from "./UI/animated-modal";
import { useFutoshikiStore } from "../store";
import { useState, useEffect } from "react";

interface Report {
  optimized_final_solution: number[][];
  simple_final_solution: number[][];
  optimized_time: number;
  simple_time: number;
  optimized_backtracks: number;
  simple_backtracks: number;
}

const ReportModal = () => {
  const [report, setReport] = useState<Report | null>(null);
  const { grid, constraints, gridSize, solverType } = useFutoshikiStore();

  useEffect(() => {
    const fetchReport = () => {
      axios
        .post("http://127.0.0.1:8000/solve-compared", {
          Grid: grid,
          Constraints: constraints,
          GridSize: gridSize,
          SolverType: solverType,
        })
        .then((res) => setReport(res.data.report))
        .catch((err) => console.log(err));
    };

    fetchReport();
  }, []);

  return (
    <Modal>
      <ModalTrigger className='bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all active:scale-105 cursor-pointer'>
        More Details
      </ModalTrigger>

      <ModalBody className='md:max-w-xl'>
        <ModalContent className='items-center md:items-start'>
          <div className='grid md:grid-cols-2 grid-cols-1 items-center justify-items-center gap-4 md:gap-10 w-full'>
            <h2 className='text-lg font-semibold'>Optimized Solution</h2>
            <p className='text-sm text-gray-500'>
              <div className='flex flex-col gap-1 text-center'>
                {report?.optimized_final_solution.map((row) => (
                  <div
                    key={row.join(",")}
                    className='flex flex-row items-center gap-1'
                  >
                    {row.map((cell) => (
                      <div
                        key={cell}
                        className='w-6 h-6 text-center bg-gray-200 hover:bg-gray-300 transition-colors rounded-md'
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </p>

            <h2 className='text-lg font-semibold'>Simple Solution</h2>
            <p className='text-sm text-gray-500'>
              <div className='flex flex-col gap-1 text-center'>
                {report?.simple_final_solution.map((row) => (
                  <div
                    key={row.join(",")}
                    className='flex flex-row items-center gap-1'
                  >
                    {row.map((cell) => (
                      <div
                        key={cell}
                        className='w-6 h-6 text-center bg-gray-200 hover:bg-gray-300 transition-colors rounded-md'
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </p>

            <h2 className='text-lg font-semibold'>Simple Time</h2>
            <p className='text-sm text-gray-500'>{report?.simple_time}</p>

            <h2 className='text-lg font-semibold'>Optimized Time</h2>
            <p className='text-sm text-gray-500'>
              {report?.optimized_time.toFixed(6)} ms
            </p>

            <h2 className='text-lg font-semibold'>Optimized Backtracks</h2>
            <p className='text-sm text-gray-500'>
              {report?.optimized_backtracks}
            </p>
          </div>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default ReportModal;
