import React from "react";
import BookCard from "../components/PopularBooks";
import Categories from "../components/Categories";

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="bg-blue-50 rounded-lg shadow-md p-8 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Your Library</h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover thousands of books across multiple categories.
            Borrow, read, and expand your knowledge with our extensive collection.
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search for books..."
              className="p-2 w-full max-w-md rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popular books section */}
      <BookCard />

      {/* Categories section */}
      <Categories />
    </div>
  );
}

export default Home;
