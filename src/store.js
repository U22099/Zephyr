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
export const useNav = create(set => ({
  nav: 2,
  setNav: (nav) => {
    set({ nav });
  },
}));
export const useMsg = create(set => ({
  msg: [],
  setMsg: (msg) => {
    set({ msg });
  },
}));
export const usePeople = create(set => ({
  people: [],
  setPeople: (data) => {
    set({ data });
  },
}));
/*set((state) => ({ userData: { ...state.userData, ...newData } }))*/