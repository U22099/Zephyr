import { create } from "zustand";

export const useUserData = create(set => ({
  userData: {},
  setUserData: (data) => {
    set({ data });
  }
}));