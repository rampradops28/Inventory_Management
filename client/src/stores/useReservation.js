import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useReservationStore = create((set, get) => ({
  reservations: [],
  reservationHistory: [],
  reservation: null,
  loading: false,

  getUserReservations: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reservations/");
      set({ reservations: res.data.reservations, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log("error occurred in get user reservations", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  createReservation: async (bookId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/reservations", {
        book_id: bookId,
      });
      set({ loading: false });
      get().getUserReservations();
      toast.success(res.data.message);
    } catch (error) {
      set({ loading: false });
      console.log("error occurred in create reservation", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  getUserBorrowHistory: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reservations/history");
      set({ reservationHistory: res.data.borrowHistory, loading: false });
      console.log("borrow history", res.data.borrowHistory);
    } catch (error) {
      set({ loading: false });
      console.log("error occurred in get user borrow history", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
}));
