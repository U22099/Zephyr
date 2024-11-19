import { create } from "zustand";

export const useUserData = create(set => ({
  userData: {},
  setUserData: (data) => {
    set({ userData:data });
  },
}));

/*set((state) => ({ userData: { ...state.userData, ...newData } }))*/