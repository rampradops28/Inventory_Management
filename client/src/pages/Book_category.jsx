import React, { useState } from "react";
import { useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

const CategoryBooks = ({ books, categories }) => {
  const { categoryName } = useParams();
  const category = categories.find((cat) => cat.name === categoryName);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const filteredBooks = books.filter(
    (book) =>
      book.category === category.id &&
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="m-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex justify-center items-center pt-10 bg-gray-100 dark:bg-gray-800"
      >
        <div className="flex items-center border rounded-md overflow-hidden shadow-md w-full max-w-lg bg-white dark:bg-gray-700">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a book..."
            className="flex-grow px-3 py-2 outline-none text-black dark:text-white bg-white dark:bg-gray-700"
          />
          <Button type="submit" className="bg-blue-500 px-4 py-2 text-white">
            <FaSearch />
          </Button>
        </div>
      </form>
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {category.name} Books
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="border rounded-md p-4 w-48 bg-white dark:bg-gray-700"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-32 object-cover mb-2 rounded-md"
              />
              <h3 className="text-lg font-bold">{book.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {book.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBooks;
