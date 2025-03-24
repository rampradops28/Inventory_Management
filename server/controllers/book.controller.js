// local dependencies
import { errorHandler } from "../utils/errorHandler.js";
import cloudinary from "../lib/cloudinary.js";

// book model
import Book from "../models/book.model.js";

// admin book controller

// create a book
export const createBook = async (req, res, next) => {
  try {
    const { title, category, author, availableCopies, description, image } =
      req.body;

    if (!title || !category || !author || !description || !availableCopies) {
      return next(errorHandler(400, "All fields are required"));
    }

    if (isNaN(availableCopies) || availableCopies < 1) {
      return next(
        errorHandler(400, "Available copies must be a positive number")
      );
    }

    let imageUrl = "";
    if (image) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "books",
        });
        imageUrl = cloudinaryResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return next(errorHandler(500, "Error uploading image"));
      }
    }

    const book = new Book({
      title: title,
      category: category,
      author: author,
      availableCopies,
      description: description,
      image: imageUrl,
    });

    await book.save();
    res
      .status(201)
      .json({ success: true, message: "Book created successfully", book });
  } catch (error) {
    console.error("Error in createBook:", error);
    next(errorHandler(500, "Error in creating book"));
  }
};

// delete a book
export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(errorHandler(400, "Book ID is required"));

    const book = await Book.findById(id);
    if (!book) return next(errorHandler(404, "Book not found"));

    if (book.image) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from cloudinary:", error);
      }
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully" });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("error in delete book", error);
    next(errorHandler(400, "Error in deleting book"));
  }
};

//update a book
export const updateBook = async (req, res, next) => {
  try {
    const { title, category, author, availableCopies, description, image } =
      req.body;
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return next(errorHandler(404, "Book not found"));
    }

    let imageUrl = "";

    if (image) {
      if (book.image) {
        const publicId = book.image.split("/").pop().split(".")[0];

        // Delete old image from Cloudinary
        try {
          await cloudinary.uploader.destroy(`books/${publicId}`);
        } catch (deleteError) {
          console.error(
            "Error deleting old image from Cloudinary:",
            deleteError
          );
          return next(errorHandler(500, "Error deleting old image"));
        }
      }

      // Upload new image to Cloudinary
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "books",
        });
        imageUrl = cloudinaryResponse.secure_url;
      } catch (uploadError) {
        console.error("Error uploading new image to Cloudinary:", uploadError);
        return next(errorHandler(500, "Error uploading new image"));
      }
    }

    book.title = title || book.title;
    book.category = category || book.category;
    book.author = author || book.author;
    book.availableCopies = availableCopies || book.availableCopies;
    book.description = description || book.description;
    book.image = imageUrl || book.image;

    await book.save();

    res
      .status(200)
      .json({ success: true, message: "Book updated successfully", book });
  } catch (error) {
    console.error("Error in updateBook:", error);
    next(errorHandler(500, "Error updating book"));
  }
};

// searching and filtering books or get all books
export const getBooks = async (req, res, next) => {
  try {
    const { search, category, author } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (author) filter.author = author;

    const books =
      Object.keys(filter).length > 0
        ? await Book.find(filter)
        : await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error in getBooks:", error);
    next(errorHandler(500, "Error getting books"));
  }
};
