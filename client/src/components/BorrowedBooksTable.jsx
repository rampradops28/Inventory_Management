import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAdminStore } from "@/stores/useAdminStore";

function BorrowedBooksTable() {
  const { getBorrowedBooks, borrowedBooks, loading } = useAdminStore();

  useEffect(() => {
    getBorrowedBooks();
  }, [getBorrowedBooks]);

  // export data as CSV
  const exportToCSV = () => {
    if (!borrowedBooks || borrowedBooks.length === 0) return;

    //  CSV headers
    const headers = [
      "Book Title",
      "User Name",
      "User Email",
      "Contact",
      "Borrowed Date",
    ];

    // Format borrowed data for CSV
    const csvData = borrowedBooks.map((book) => [
      book.title,
      book.user_name,
      book.email,
      book.contact,
      new Date(book.borrowed_date).toDateString(),
    ]);

    // Create CSV content with proper escaping
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row
          .map((cell) =>
            // Handle commas and quotes in cell values
            typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell
          )
          .join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set download attributes
    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `borrowed-books-report-${date}.csv`);

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Borrowed Books</h2>
        <Button
          onClick={exportToCSV}
          className="flex items-center gap-2"
          variant="default"
          disabled={!borrowedBooks || borrowedBooks.length === 0}
        >
          <Download size={16} />
          Export as CSV
        </Button>
      </div>

      {borrowedBooks && borrowedBooks.length > 0 ? (
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
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          No borrowed books found
        </div>
      )}
    </div>
  );
}

export default BorrowedBooksTable;
