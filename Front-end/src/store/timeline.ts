import { create } from "zustand";

interface TimelineStore {
  playSpeed: number;
  setPlaySpeed: (speed: number) => void;

  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;

  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;

  skipToEnd: () => void;
  reset: () => void;
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  playSpeed: 500,
  isPlaying: false,
  currentStepIndex: 0,

  setPlaySpeed: (speed) => {
    set({ playSpeed: speed });
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

  skipToEnd: () => {
    set({ isPlaying: false });
  },

  reset: () => {
    set({
      currentStepIndex: 0,
      isPlaying: false,
    });
  },
}));
