import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
function BooksTable() {
  const books = [
    {
      title: "The Great Gatsby",
      category: "Fiction",
      availableCopies: 5,
      author: "F. Scott Fitzgerald",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjwR_qwwP-PgM2uGa5crh8YvIhpV_yc7LNXA&s",
    },
    {
      title: "To Kill a Mockingbird",
      category: "Classic",
      availableCopies: 3,
      author: "Harper Lee",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjwR_qwwP-PgM2uGa5crh8YvIhpV_yc7LNXA&s",
    },
  ];

  const handleUpdate = (book) => {
    console.log("Update book:", book);
  };

  const handleDelete = (book) => {
    console.log("Delete book:", book);
  };

  return (
    <div className="mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Available Copies</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.category}</TableCell>
              <TableCell>{book.availableCopies}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleUpdate(book)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default BooksTable;
