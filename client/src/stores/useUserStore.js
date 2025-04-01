import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  googleLoading: false,
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
      await get().checkAuth();
      setTimeout(() => {
        navigate("/");
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
        code: token,
      });

      set({ user: res.data, loading: false });
      toast.success("Email verified successfully");
      await get().checkAuth();
      console.log("Navigating to home...");
      navigate("/");
      console.log("Navigation executed.");
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
      set({ user: res.data.user, loading: false });
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
      const res = await axiosInstance.post("/auth/forget-password", {
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

  resetPassword: async (resetToken, password, navigate) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post(
        `/auth/reset-password/${resetToken}`,
        {
          password,
        }
      );

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
      console.log("user", res.data.user);
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.log(error.response, "error in checking auth");
    }
  },

  logout: async (navigate) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ user: null, loading: false });
      if (navigate) navigate("/login"); // Make navigate optional
    } catch (error) {
      set({ loading: false });
      console.log("error in logout", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  google: async (email, name, imageUrl, navigate) => {
    set({ googleLoading: true });
    try {
      const res = await axiosInstance.post("/auth/google-oauth", {
        email,
        name,
        imageUrl,
      });
      set({ user: res.data.user, googleLoading: false });
      toast.success("Login successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      set({ googleLoading: false });
      console.log("error in google login", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  updateProfile: async (name, email, contact, address, image) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch("/auth/profile-update", {
        name,
        email,
        contact,
        address,
        image,
      });
      set({ user: res.data.user, loading: false });
      toast.success("Profile updated successfully");
    } catch (error) {
      set({ loading: false });
      console.log("error in updating profile", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout without navigation
        useUserStore.getState().logout(); // This should work if you've made navigate optional
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
