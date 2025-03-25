import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (email, password, navigate) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", {
        email,
        password,
      });

      set({ user: res.data, loading: false });
      toast.success("Signup successful");
      setTimeout(() => {
        navigate("/verify-email");
      }, 2000);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occured in signup", error.response);
    }
  },

  verifyEmail: async (token, navigate) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/verify-email", {
        token,
      });

      set({ user: res.data, loading: false });
      toast.success("Email verified successfully");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occured in verify email", error.response);
    }
  },

  login: async (email, password, navigate) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data, loading: false });
      toast.success("Login successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occured in login", error.response);
    }
  },

  forgetPassword: async (email) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/api/forget-password", {
        email,
      });

      toast.success(res.data.message);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occured in reset password email  ", error.response);
    }
  },

  resetPassword: async (token, password, navigate) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post(`/api/reset-password/${token}`, {
        password,
      });

      toast.success(res.data.message);
      set({ loading: false });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occured in reset password", error.response);
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.log(error.response, "error in checking auth");
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
    } catch (error) {
      console.log("error in logout", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
}));
