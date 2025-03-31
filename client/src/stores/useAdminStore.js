import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useAdminStore = create((set, get) => ({
  users: [],
  reservations: [],
  borrowedBooks: [],
  loading: false,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/admin/users");
      set({ users: res.data.users, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log("error occurred in get all users for admin", error.response);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  getAllReservations: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reservations/all");
      set({ reservations: res.data.reservations, loading: false });
      console.log("all reservations", res.data.reservations);
    } catch (error) {
      set({ loading: false });
      console.log(
        "error occurred in get all reservations for admin",
        error.response
      );
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  markReservationAsBorrowed: async (reservationId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put(`/reservations/${reservationId}`);
      get().getAllReservations();
      set({ loading: false });
      toast.success(
        res.data.message || "Reservation marked as borrowed successfully"
      );
    } catch (error) {
      set({ loading: false });
      console.log(
        "error occurred in mark reservation as borrowed",
        error.response
      );
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  markReservationAsCompleted: async (reservationId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put(
        `/reservations/completed/${reservationId}`
      );
      get().getAllReservations();
      set({ loading: false });
      toast.success(
        res.data.message || "Reservation marked as completed successfully"
      );
    } catch (error) {
      set({ loading: false });
      console.log(
        "error occurred in mark reservation as completed",
        error.response
      );
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  getBorrowedBooks: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reservations/borrowed");
      set({ borrowedBooks: res.data.borrowedBooks, loading: false });
      console.log("borrowed books", res.data.borrowedBooks);
    } catch (error) {
      set({ loading: false });
      console.log(
        "error occurred in get borrowed books for admin",
        error.response
      );
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
}));
