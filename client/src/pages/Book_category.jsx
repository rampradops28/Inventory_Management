import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
    <div className="p-6 text-white bg-gray-900 min-h-screen">
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
            className="w-full p-2 pl-4 pr-10 border rounded-md bg-gray-800 text-white focus:outline-none"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md w-48 text-center"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-32 object-cover mb-2 rounded-md"
              />
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-gray-400">{book.author}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No books found.</p>
        )}
      </div>
    </div>
  );
}

export default BookCategory;
