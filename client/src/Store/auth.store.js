import { create } from "zustand";

const useAuthStore = create((set) => ({
  email: null,

  // Function to set email after signup
  setEmail: (email) => set({ email }),

  // Function to clear email (if needed)
  clearEmail: () => set({ email: null }),
}));

export default useAuthStore;
