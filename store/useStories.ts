import { create } from "zustand";

type Store = {
  isOpen: boolean;
  setOpen: () => void;
};

export const useStories = create<Store>()((set) => ({
  isOpen: false,
  setOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
