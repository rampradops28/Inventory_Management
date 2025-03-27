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
import { useBookStore } from "@/stores/useBookStore";
import { useEffect } from "react";

function BooksTable() {
  const { getAllBooks, loading, books, deleteBook } = useBookStore();
  useEffect(() => {
    getAllBooks();
  }, []);

  const handleUpdate = async (book) => {
    console.log("Update book:", book);
  };

  const handleDelete = async (book) => {
    await deleteBook(book.id);
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
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.category}</TableCell>
              <TableCell>{book.quantity}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                <img
                  src={
                    book.image ||
                    "https://png.pngtree.com/png-clipart/20220503/ourmid/pngtree-stack-of-school-books-png-image_4561890.png"
                  }
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
                    {loading ? "Deleting..." : "Delete"}
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
