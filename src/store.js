import { create } from "zustand";

export const useUserData = create(set => ({
  userData: {},
  setUserData: (userData) => {
    set({ userData });
  },
}));
export const useUID = create(set => ({
  uid: "",
  setUID: (uid) => {
    set({ uid });
  },
}));
export const usePage = create(set => ({
  page: {
    open: false,
    component: "default"
  },
  setPage: (page) => {
    set({ page });
  },
}));
/*set((state) => ({ userData: { ...state.userData, ...newData } }))*/