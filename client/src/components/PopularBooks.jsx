import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBookStore } from "@/stores/useBookStore";

const BookCard = ({ title, author, cover }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-105 hover:transition-transform">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-50 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-500 dark:text-gray-400">No Cover</span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {author}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

const PopularBooks = () => {
  const { books, loading, getAllBooks } = useBookStore();

  useEffect(() => {
    getAllBooks();
  }, [getAllBooks]); // Ensure `getAllBooks` is stable (e.g., memoized)

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section
      id="books"
      className="my-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-10 rounded-2xl shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-purple-purse">
        Popular Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            cover={book.image_url}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularBooks;
