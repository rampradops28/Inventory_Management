import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grip } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { Button } from "./ui/button";

function ReservationTable() {
  const {
    getAllReservations,
    reservations,
    loading,
    markReservationAsBorrowed,
    markReservationAsCompleted,
  } = useAdminStore();

  const [activeFilter, setActiveFilter] = useState("all");

  const [filteredReservations, setFilteredReservations] = useState([]);

  useEffect(() => {
    getAllReservations();
  }, [getAllReservations]);

  useEffect(() => {
    if (!reservations) return;

    if (activeFilter === "all") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(
        reservations.filter(
          (reservation) =>
            reservation.status.toLowerCase() === activeFilter.toLowerCase()
        )
      );
    }
  }, [reservations, activeFilter]);

  const handleBorrowed = async (reservationId) => {
    await markReservationAsBorrowed(reservationId);
  };

  const handleCompleted = async (reservationId) => {
    await markReservationAsCompleted(reservationId);
  };

  // Filter tab
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "borrowed", label: "Borrowed" },
    { value: "completed", label: "Completed" },
  ];

  if (!reservations || reservations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          No reservations found
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex space-x-2 mb-4">
        {filterOptions.map((option) => (
          <Button
            variant="default"
            key={option.value}
            className={`${
              activeFilter === option.value
                ? "bg-gray-700 text-white"
                : "bg-gray-500 text-gray-100 hover:bg-gray-700"
            }`}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Reservation Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fine</TableHead>
            <TableHead>Days Overdue</TableHead>
            <TableHead>Change Status</TableHead>
            <TableHead>Return Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredReservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No reservations found for this filter
              </TableCell>
            </TableRow>
          ) : (
            filteredReservations.map((reservation) => (
              <TableRow key={reservation.reservation_id}>
                <TableCell className="font-medium">
                  {reservation.book_title}
                </TableCell>
                <TableCell>{reservation.user_name}</TableCell>
                <TableCell>{reservation.email}</TableCell>
                <TableCell>
                  {new Date(reservation.reservation_date).toDateString()}
                </TableCell>
                <TableCell>{reservation.status}</TableCell>
                <TableCell>{reservation.fine}</TableCell>
                <TableCell>
                  {(() => {
                    const reservationDate = new Date(
                      reservation.reservation_date
                    );
                    const currentDate = new Date();
                    const diffInDays = Math.floor(
                      (currentDate - reservationDate) / (1000 * 60 * 60 * 24)
                    );

                    return diffInDays > 7
                      ? `${diffInDays - 7} days overdue`
                      : "Not Overdue";
                  })()}
                </TableCell>
                <TableCell>
                  {reservation.status === "completed" ? (
                    "Completed Reservation"
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="font-bold ml-8">
                        <Grip size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {reservation.status !== "borrowed" &&
                          reservation.status !== "completed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleBorrowed(reservation.reservation_id)
                              }
                            >
                              Borrowed
                            </DropdownMenuItem>
                          )}
                        {reservation.status === "borrowed" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleCompleted(reservation.reservation_id)
                            }
                          >
                            Completed
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
                <TableCell>
                  {reservation.status === "completed"
                    ? reservation.returned_date
                      ? new Date(reservation.returned_date).toDateString()
                      : "Not Returned"
                    : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ReservationTable;
