import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Corrected import

const BookDetails = () => {
  const [categories] = useState([
    { id: 1, name: "Fiction", description: "Explore fictional books" },
    { id: 2, name: "Non-Fiction", description: "Explore non-fictional books" },
    { id: 3, name: "Science", description: "Explore science books" },
    { id: 4, name: "History", description: "Explore history books" },
  ]);

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/book-category/${categoryName}`);
  };

  return (
    <div className="m-4">
      <div className="mt-10 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Book Categories
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Explore our wide range of book categories
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-6 cursor-pointer bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105 transition-transform"
              onClick={() => handleCategoryClick(category.name)}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
