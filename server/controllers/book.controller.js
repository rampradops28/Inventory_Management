// local dependencies
import { errorHandler } from "../utils/errorHandler.js";
import cloudinary from "../lib/cloudinary.js";
import db from "../db.js";

// Book controller

// Create a book
export const createBook = async (req, res, next) => {
  try {
    const { title, category, description, quantity, location, image } = req.body;

    // Validate required fields
    if (!title || !category || !description) {
      return next(errorHandler(400, "Title, category, and description are required"));
    }

    // Validate quantity
    if (isNaN(quantity) || quantity < 0) {
      return next(errorHandler(400, "Quantity must be a non-negative number"));
    }

    let image_url = "https://pngimg.com/d/book_PNG51090.png"; // Default image

    // Upload image to cloudinary if provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "library_books",
      });
      image_url = uploadResponse.secure_url;
    }

    // Insert book into database
    const [result] = await db.execute(
      "INSERT INTO books (title, description, category, quantity, location, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, category, quantity || 0, location || "", image_url]
    );

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: {
        id: result.insertId,
        title,
        description,
        category,
        quantity,
        location,
        image_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all books
export const getAllBooks = async (req, res, next) => {
  try {
    const [books] = await db.query("SELECT * FROM books");
    
    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    next(error);
  }
};

// Get book by ID
export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
    
    if (books.length === 0) {
      return next(errorHandler(404, "Book not found"));
    }
    
    res.status(200).json({
      success: true,
      book: books[0],
    });
  } catch (error) {
    next(error);
  }
};

// Update book
export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, description, quantity, location, image } = req.body;
    
    // Check if book exists
    const [existingBooks] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
    
    if (existingBooks.length === 0) {
      return next(errorHandler(404, "Book not found"));
    }
    
    const existingBook = existingBooks[0];
    let image_url = existingBook.image_url;
    
    // Upload new image if provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "library_books",
      });
      image_url = uploadResponse.secure_url;
    }
    
    // Update book in database
    await db.execute(
      "UPDATE books SET title = ?, description = ?, category = ?, quantity = ?, location = ?, image_url = ? WHERE id = ?",
      [
        title || existingBook.title,
        description || existingBook.description,
        category || existingBook.category,
        quantity !== undefined ? quantity : existingBook.quantity,
        location || existingBook.location,
        image_url,
        id
      ]
    );
    
    // Get updated book
    const [updatedBooks] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
    
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBooks[0],
    });
  } catch (error) {
    next(error);
  }
};

// Delete book
export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if book exists
    const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
    
    if (books.length === 0) {
      return next(errorHandler(404, "Book not found"));
    }
    
    // Delete book from database
    await db.execute("DELETE FROM books WHERE id = ?", [id]);
    
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};