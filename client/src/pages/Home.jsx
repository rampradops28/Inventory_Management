import React from "react";
import BookCard from "../components/PopularBooks";
import Services from "../components/Services";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="bg-blue-50 rounded-lg shadow-md p-8 mb-8 dark:bg-gray-900 dark:text-gray-300">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold  mb-4 font-poppins">
            Welcome to Lendify
          </h1>
          <p className="text-lg  mb-6 ">
            Discover thousands of books across multiple categories. Borrow,
            read, and expand your knowledge with our extensive collection.
          </p>
          <div className="flex justify-center">
            <Link to="/book-category">
              <Button variant="default">Get Started Now</Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Book component />*/}
      <BookCard />
      {/* Services component />*/}
      <Services />
    </div>
  );
}

export default Home;
