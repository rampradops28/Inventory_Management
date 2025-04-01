import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useBookStore = create((set, get) => ({
  books: [],
  book: null,
  loading: false,

  getAllBooks: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/books/");
      set({ books: res.data.books, loading: false });

      console.log(res.data.books);
    } catch (error) {
      console.log(error);
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occurred in get all books ", error.response);
    }
  },

  deleteBook: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.delete(`/books/${id}`);
      set({ loading: false });
      toast.success(res.data.message);
      get().getAllBooks();
    } catch (error) {
      console.log(error);
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occurred in delete book for admin", error.response);
    }
  },

  addBook: async (data) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/books", {
        title: data.title,
        category: data.category,
        description: data.description,
        quantity: data.availableCopies,
        location: data.location,
        image: data.image,
        author: data.author,
      });
      set({ loading: false });
      get().getAllBooks();
      toast.success(res.data.message);
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("error occurred in add book for admin", error.response);
    }
  },

  updateBook: async (id, data) => {
    set({ loading: true });
    try {
      console.log("data", data);
      const payload = {
        title: data.title,
        category: data.category,
        description: data.description,
        quantity: data.availableCopies,
        location: data.location,
        author: data.author,
      };

      if (data.image) {
        payload.image = data.image;
      }
      const res = await axiosInstance.patch(`/books/${id}`, payload);
      set({ loading: false });
      get().getAllBooks();
      toast.success(res.data.message);
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  getCategoryBooks: async (category) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/books/search?category=${category}`);
      set({ books: res.data.books, loading: false });
      console.log(res.data.books);
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },

  searchBooks: async (searchTerm) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(
        `/books/search?title=${searchTerm}&author=${searchTerm}`
      );
      set({ books: res.data.books, loading: false });
      console.log(res.data.books);
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  getBookById: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/books/${id}`);
      set({ book: res.data.book, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
}));
