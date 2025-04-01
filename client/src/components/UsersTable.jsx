import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";

function UsersTable({}) {
  const { getAllUsers, users } = useAdminStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          No users found
        </p>
      </div>
    );
  }
  return (
    <div className="mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Registered On</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Display Pic</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.created_at).toDateString()}</TableCell>
              <TableCell>{user.contact || "To be updated"}</TableCell>
              <TableCell>{user.address || "To be updated"}</TableCell>
              <TableCell>
                <img
                  src={
                    user.image_url ||
                    "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"
                  }
                  alt={user.name}
                  className="w-13 h-13 object-cover rounded"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UsersTable;
