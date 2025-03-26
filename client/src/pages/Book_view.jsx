import React from "react";
import { useParams } from "react-router-dom";

const books = [
  // Fiction Books
  {
    id: 1,
    title: "Gone with the Wind",
    author: "Margaret Mitchell",
    category: "Fiction",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/66/Gone_with_the_Wind_cover.jpg",

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
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shakespeareandcompany.com%2Fbooks%2Fthe-name-of-the-wind&psig=AOvVaw0dH_KMNPj84evbHM-w82Yx&ust=1743063516110000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjlmuGnp4wDFQAAAAAdAAAAABAJ",
    description: "A story of friendship and redemption set in Afghanistan.",
    publicationDate: "2003",
    pages: 371,
    publisher: "Riverhead Books",
    language: "English",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shakespeareandcompany.com%2Fbooks%2Fthe-name-of-the-wind&psig=AOvVaw0dH_KMNPj84evbHM-w82Yx&ust=1743063516110000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjlmuGnp4wDFQAAAAAdAAAAABAJ",
    description: "A novel about racial injustice in the Deep South.",
    publicationDate: "1960",
    pages: 281,
    publisher: "J.B. Lippincott & Co.",
    language: "English",
  },
  {
    id: 4,
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shakespeareandcompany.com%2Fbooks%2Fthe-name-of-the-wind&psig=AOvVaw0dH_KMNPj84evbHM-w82Yx&ust=1743063516110000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjlmuGnp4wDFQAAAAAdAAAAABAJ",
    description: "A dystopian novel about totalitarianism and surveillance.",
    publicationDate: "1949",
    pages: 328,
    publisher: "Secker & Warburg",
    language: "English",
  },

  // Non-Fiction Books
  {
    id: 5,
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Non-Fiction",
    image: "/assets/images/non-fiction1.png",
    description:
      "The true story of Christopher McCandless and his journey into the Alaskan wilderness.",
    publicationDate: "1996",
    pages: 224,
    publisher: "Villard",
    language: "English",
  },
  {
    id: 6,
    title: "Educated",
    author: "Tara Westover",
    category: "Non-Fiction",
    image: "/assets/images/non-fiction2.png",
    description: "A memoir about growing up in a strict and abusive household.",
    publicationDate: "2018",
    pages: 334,
    publisher: "Random House",
    language: "English",
  },
  {
    id: 7,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Non-Fiction",
    image: "/assets/images/non-fiction3.png",
    description: "A brief history of humankind.",
    publicationDate: "2011",
    pages: 443,
    publisher: "Harvill Secker",
    language: "English",
  },
  {
    id: 8,
    title: "Becoming",
    author: "Michelle Obama",
    category: "Non-Fiction",
    image: "/assets/images/non-fiction4.png",
    description: "The memoir of former First Lady Michelle Obama.",
    publicationDate: "2018",
    pages: 426,
    publisher: "Crown Publishing Group",
    language: "English",
  },
];

function BookView() {
  const { bookId } = useParams();
  const book = books.find((b) => b.id === parseInt(bookId));

  if (!book) {
    return <p className="text-center text-white">Book not found.</p>;
  }

  const handleAddReservation = () => {
    alert(`You have reserved "${book.title}" by ${book.author}.`);
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

        {/* Add Reservation Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleAddReservation}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Add Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookView;
