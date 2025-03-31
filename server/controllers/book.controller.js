// local dependencies
import { errorHandler } from "../utils/errorHandler.js";
import db from "../lib/db.js";

// Cloudinary
import cloudinary from "../lib/cloudinary.js";

// Book controller

// Create a book
export const createBook = async (req, res, next) => {
  try {
    const { title, category, description, quantity, location, image, author } =
      req.body;

    if (
      (!title || !category || !description || !author || !image || !location,
      !quantity)
    ) {
      return next(
        errorHandler(
          400,
          "Title, category, author, image, quanity, location and description of the book are required"
        )
      );
    }

    if (isNaN(quantity) || quantity < 0) {
      return next(errorHandler(400, "Quantity must be a non-negative number"));
    }

    let image_url = "";
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "library_books",
        });
        image_url = uploadResponse.secure_url;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    const [result] = await db.execute(
      "INSERT INTO books (title, description, category, quantity, location, author, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, category, quantity, location, author, image_url]
    );

    const [createdBook] = await db.execute("SELECT * FROM books WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "Book created successfully",
      book: createdBook[0],
    });
  } catch (error) {
    next(error);
  }
};

// Get books by id
export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(errorHandler(400, "Book ID is required"));
    }

    const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);

    if (books.length === 0) {
      return next(errorHandler(404, "Book not found"));
    }

    res.status(200).json({
      book: books[0],
    });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// Get  books by category or author or title
export const searchBooks = async (req, res, next) => {
  try {
    const { category, title, author } = req.query;

    let query = "SELECT * FROM books WHERE 1=1";
    const queryParams = [];

    // Add filtering by category if provided
    if (category) {
      query += " AND category LIKE ?";
      queryParams.push(`%${category}%`);
    }

    // Add filtering by title if provided
    if (title) {
      query += " OR title LIKE ?";
      queryParams.push(`%${title}%`);
    }

    // Add filtering by author if provided
    if (author) {
      query += " OR author LIKE ?";
      queryParams.push(`%${author}%`);
    }

    // Execute
    const [books] = await db.execute(query, queryParams);

    if (books.length === 0) {
      return next(errorHandler(404, "No books found matching the criteria"));
    }

    res.status(200).json({
      books,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// Update book
export const updateBook = async (req, res, next) => {
  try {
    console.log(req.body, "inside update book");
    const { id } = req.params;
    const { title, category, description, quantity, location, image, author } =
      req.body;

    const [bookResult] = await db.execute("SELECT * FROM books WHERE id = ?", [
      id,
    ]);

    if (bookResult.length === 0) {
      return next(errorHandler(404, "Book not found"));
    }

    const existingBook = bookResult[0];
    let image_url = existingBook.image_url;

    if (image) {
      try {
        // Extract the public ID of the existing image from the URL
        const publicId = image_url.split("/").pop().split(".")[0];

        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(`library_books/${publicId}`);

        // Upload the new image
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "library_books",
        });
        image_url = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error updating image:", error);
        return next(errorHandler(500, "Failed to update the book image"));
      }
    }

    await db.execute(
      "UPDATE books SET title = ?, description = ?, category = ?, quantity = ?, location = ?, image_url = ?, author = ? WHERE id = ?",
      [
        title || existingBook.title,
        description || existingBook.description,
        category || existingBook.category,
        quantity !== undefined ? quantity : existingBook.quantity,
        location || existingBook.location,
        image_url,
        author || existingBook.author,
        id,
      ]
    );

    const [updatedBookResult] = await db.execute(
      "SELECT * FROM books WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBookResult[0],
    });
  } catch (error) {
    console.error("Error updating book:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// Delete book
export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [book] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);

    if (book.length === 0) {
      return next(errorHandler(404, "Book not found"));
    }

    if (book.image_url) {
      try {
        const publicId = book.image_url.split("/").pop().split(".")[0];

        await cloudinary.uploader.destroy(`library_books/${publicId}`);
      } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
      }
    }

    await db.execute("DELETE FROM books WHERE id = ?", [id]);

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get all books
export const getAllBooks = async (req, res, next) => {
  try {
    const [books] = await db.execute("SELECT * FROM books");

    res.status(200).json({
      books: books,
    });
  } catch (error) {
    console.log("Error fetching all books:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
