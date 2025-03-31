import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookStore } from "@/stores/useBookStore";
import LoadingSpinner from "@/components/LoadingScreen";

function BookCategory() {
  const { books, loading, getCategoryBooks, searchBooks } = useBookStore();
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCategoryBooks(categoryName);
  }, [categoryName, getCategoryBooks]);

  const handleSearchChange = async (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    await searchBooks(searchValue);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.category.toLowerCase() === categoryName.toLowerCase() &&
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen m-10 p-10 rounded-2xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        {categoryName} Books
      </h1>

      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-12 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-poppins"
          />
          <IoIosSearch className="absolute left-4 top-3 text-gray-500 dark:text-gray-300 text-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => handleBookClick(book.id)}
            >
              <CardHeader className="p-0">
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
                <CardDescription className="mb-4">
                  {book.author}
                </CardDescription>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookClick(book.id);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No books found Please try a different search term or check back
              later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCategory;
