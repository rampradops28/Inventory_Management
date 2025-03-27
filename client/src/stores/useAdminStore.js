import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useAdminStore = create((set, get) => ({
  users: [],
  loading: false,

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/admin/users");
      set({ users: res.data.users, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occurred in get all users for admin", error.response);
    }
  },
}));
