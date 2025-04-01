import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";
import { useBookStore } from "@/stores/useBookStore";
import { useReservationStore } from "@/stores/useReservation";

function BookView() {
  const { loading: createLoading, createReservation } = useReservationStore();
  const { book, getBookById, loading } = useBookStore();
  const { user } = useUserStore();
  const { bookId } = useParams();

  useEffect(() => {
    getBookById(bookId);
  }, [bookId, getBookById]);

  const handleSubmit = async (id) => {
    await createReservation(id);
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-xl text-gray-400">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen  p-6">
      <Card className="max-w-3xl w-full bg-gray-700 text-white shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-700 p-6 text-center">
          <CardTitle className="text-4xl font-bold text-gray-100">
            {book.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={book.image_url}
              alt={book.title}
              className="w-44 h-64 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            />
            <div className="space-y-3 text-gray-300">
              <p className="text-lg">
                <span className="font-semibold text-gray-100">Author:</span>{" "}
                {book.author}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-100">Category:</span>{" "}
                {book.category}
              </p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
            {book.description}
          </p>
          {user ? (
            <div className="text-center">
              <Button variant="default" onClick={() => handleSubmit(book.id)}>
                {createLoading ? "Loading..." : "Add Reservation"}
              </Button>
            </div>
          ) : (
            <p className="text-center text-gray-300 mt-6 flex items-center justify-center gap-2">
              Please log in to add a reservation.
              <Link to="/login" varient="default">
                Login
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BookView;
