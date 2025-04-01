import express from "express";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  createBook,
  deleteBook,
  updateBook,
  getBookById,
  searchBooks,
  getAllBooks,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/search/", searchBooks);
router.post("/", protectedRoute, adminRoute, createBook);
router.get("/:id", getBookById);
router.delete("/:id", protectedRoute, adminRoute, deleteBook);
router.patch("/:id", protectedRoute, adminRoute, updateBook);
router.get("/", getAllBooks);

export default router;
