import React, { useState } from "react";
import { useParams } from "react-router";
import { FaSearch } from "react-icons/fa";

const books = [
  {
    id: 1,
    title: "Gone with the Wind",
    author: "Margaret Mitchell",
    category: "Fiction",
    image: "/images/fiction.png",
  },
  {
    id: 2,
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    category: "Fiction",
    image: "/assets/images/fiction2.png",
  },
  {
    id: 3,
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Non-Fiction",
    image: "/assets/images/non-fiction.png",
  },
];

function BookCategory() {
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.category.toLowerCase() === categoryName.toLowerCase() &&
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        {categoryName} Books
      </h1>
      <div className="flex justify-center mb-6">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search for a book..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 pl-4 pr-10 border rounded-md 
              bg-gray-100 dark:bg-gray-700 
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-600
              focus:outline-none 
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500 dark:text-gray-300" />
        </div>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 
                p-4 rounded-lg shadow-md w-48 text-center
                border border-gray-200 dark:border-gray-700"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-32 object-cover mb-2 rounded-md"
              />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {book.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{book.author}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No books found.
          </p>
        )}
      </div>
    </div>
  );
}

export default BookCategory;
