import { create } from 'zustand'

interface ScrollState {
  progress: number
  pointerX: number
  pointerY: number
  setProgress: (p: number) => void
  setPointer: (x: number, y: number) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  setProgress: (p) => set({ progress: Math.max(0, Math.min(1, p)) }),
  setPointer: (x, y) => set({ pointerX: x, pointerY: y }),
}))
