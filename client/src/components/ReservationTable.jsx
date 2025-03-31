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

import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";

function ReservationTable() {
  const {
    getAllReservations,
    reservations,
    loading,
    markReservationAsBorrowed,
    markReservationAsCompleted,
  } = useAdminStore();

  useEffect(() => {
    getAllReservations();
  }, [getAllReservations]);

  const handleBorrowed = async (reservationId) => {
    await markReservationAsBorrowed(reservationId);
  };

  const handleCompleted = async (reservationId) => {
    await markReservationAsCompleted(reservationId);
  };

  return (
    <div className="mt-10">
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
          {reservations?.map((reservation) => (
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
              {reservation.status === "completed" && (
                <TableCell>
                  {reservation.returned_date
                    ? new Date(reservation.returned_date).toDateString()
                    : "Not Returned"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ReservationTable;
