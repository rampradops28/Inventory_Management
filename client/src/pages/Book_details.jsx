import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa"; // Import search icon

const BookDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([
    { id: 1, name: "Fiction", description: "Explore fictional books" },
    { id: 2, name: "Non-Fiction", description: "Explore non-fictional books" },
    { id: 3, name: "Science", description: "Explore science books" },
    { id: 4, name: "History", description: "Explore history books" },
    { id: 5, name: "Biography", description: "Explore biographies" },
    { id: 6, name: "Fantasy", description: "Explore fantasy books" },
    { id: 7, name: "Mystery", description: "Explore mystery books" },
    { id: 8, name: "Romance", description: "Explore romance books" },
  ]);

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Add your search logic here
    console.log("Searching for:", searchTerm);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div>
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
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Book Categories
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Explore our wide range of book categories
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-md p-4 cursor-pointer bg-white dark:bg-gray-700"
              onClick={() => handleCategoryClick(category.id)}
            >
              <h3 className="text-lg font-bold">{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
