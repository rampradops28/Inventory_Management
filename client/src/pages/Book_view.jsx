import React from "react";
import { useParams } from "react-router-dom";

const books = [
  {
    id: 1,
    title: "Gone with the Wind",
    author: "Margaret Mitchell",
    category: "Fiction",
    image: "/assets/images/fiction.png",
    description:
      "A historical novel set in the American South during the Civil War.",
    publicationDate: "1936",
    pages: 1037,
    publisher: "Macmillan Publishers",
    language: "English",
  },
  {
    id: 2,
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    category: "Fiction",
    image: "/assets/images/fiction2.png",
    description: "A story of friendship and redemption set in Afghanistan.",
    publicationDate: "2003",
    pages: 371,
    publisher: "Riverhead Books",
    language: "English",
  },
  {
    id: 3,
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Non-Fiction",
    image: "/assets/images/non-fiction.png",
    description:
      "The true story of Christopher McCandless and his journey into the Alaskan wilderness.",
    publicationDate: "1996",
    pages: 224,
    publisher: "Villard",
    language: "English",
  },
];

function BookView() {
  const { bookId } = useParams();
  const book = books.find((b) => b.id === parseInt(bookId));

  if (!book) {
    return <p className="text-center text-white">Book not found.</p>;
  }

  const handleBorrowClick = () => {
    alert(`You have borrowed "${book.title}" by ${book.author}.`);
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book Image */}
          <img
            src={book.image}
            alt={book.title}
            className="w-full md:w-1/3 h-64 object-cover rounded-md"
          />

          {/* Book Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
            <p className="text-lg text-gray-400 mb-2">
              <span className="font-semibold">Author:</span> {book.author}
            </p>
            <p className="text-lg text-gray-400 mb-2">
              <span className="font-semibold">Category:</span> {book.category}
            </p>
            <p className="text-lg text-gray-400 mb-2">
              <span className="font-semibold">Publication Date:</span>{" "}
              {book.publicationDate}
            </p>
            <p className="text-lg text-gray-400 mb-2">
              <span className="font-semibold">Pages:</span> {book.pages}
            </p>
            <p className="text-lg text-gray-400 mb-2">
              <span className="font-semibold">Publisher:</span> {book.publisher}
            </p>
            <p className="text-lg text-gray-400 mb-2">
              <span className="font-semibold">Language:</span> {book.language}
            </p>
          </div>
        </div>

        {/* Book Description */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="text-gray-300">{book.description}</p>
        </div>

        {/* Borrow Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBorrowClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Add Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookView;
