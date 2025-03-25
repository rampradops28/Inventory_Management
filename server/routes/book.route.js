import express from "express";
//import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  createBook,
  deleteBook,
  updateBook,
  getBooks,
} from "../controllers/book.controller.js";

const router = express.Router();

//router.post("/", protectedRoute, adminRoute, createBook);
//router.delete("/:id", protectedRoute, adminRoute, deleteBook);
//router.put("/:id", protectedRoute, adminRoute, updateBook);
//router.get("/", protectedRoute, getBooks);

export default router;
