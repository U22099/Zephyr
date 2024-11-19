import { create } from "zustand";

export const useUserData = create(set => ({
  userData: {},
  setUserData: (userData) => {
    set({ userData });
  },
}));
export const useUID = create(set => ({
  uid: {},
  setUID: (uid) => {
    set({ uid });
  },
}));

/*set((state) => ({ userData: { ...state.userData, ...newData } }))*/