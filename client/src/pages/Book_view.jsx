import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";

const books = [
  {
    id: 1,
    title: "Gone with the Wind",
    author: "Margaret Mitchell",
    category: "Fiction",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/66/Gone_with_the_Wind_cover.jpg",
    description:
      "A historical novel set in the American South during the Civil War.",
  },
  {
    id: 2,
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    category: "Fiction",
    image: "https://upload.wikimedia.org/wikipedia/en/d/dc/Kite_runner.jpg",
    description: "A story of friendship and redemption set in Afghanistan.",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    image:
      "https://upload.wikimedia.org/wikipedia/en/7/79/To_Kill_a_Mockingbird.JPG",
    description: "A novel about racial injustice in the Deep South.",
  },
];

function BookView() {
  const { user } = useUserStore();
  const { bookId } = useParams();
  const book = books.find((b) => b.id === parseInt(bookId));

  if (!book) {
    return <p className="text-center text-white">Book not found.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gray-800 transition-colors duration-300">
      <Card className="max-w-2xl w-full bg-gray-600  text-white shadow-lg rounded-lg dark:bg-gray-900 dark:text-gray-300 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {book.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={book.image}
              alt={book.title}
              className="w-40 h-60 object-cover rounded-md"
            />
            <div>
              <p className="text-lg text-gray-400">
                <span className="font-semibold">Author:</span> {book.author}
              </p>
              <p className="text-lg text-gray-400">
                <span className="font-semibold">Category:</span> {book.category}
              </p>
            </div>
          </div>
          <p className="text-gray-300">{book.description}</p>
          {user ? (
            <div className="text-center">
              <Button variant="default" className="w-full">
                Add Reservation
              </Button>
            </div>
          ) : (
            <p className="text-center text-gray-300 font-purple-purse dark:text-gray-100 mt-10">
              Please log in to add a reservation.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BookView;
