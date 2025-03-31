import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminStore } from "@/stores/useAdminStore";

function BorrowedBooksTable() {
  const { getBorrowedBooks, borrowedBooks, loading } = useAdminStore();
  useEffect(() => {
    getBorrowedBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Title</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Borrowed Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrowedBooks.map((borrowedBook) => (
            <TableRow key={borrowedBook.book_id}>
              <TableCell className="font-medium">
                {borrowedBook.title}
              </TableCell>
              <TableCell>{borrowedBook.user_name}</TableCell>
              <TableCell>{borrowedBook.email}</TableCell>
              <TableCell>{borrowedBook.contact}</TableCell>
              <TableCell>
                {new Date(borrowedBook.borrowed_date).toDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default BorrowedBooksTable;
