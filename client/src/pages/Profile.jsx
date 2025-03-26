import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import userPng from "../assets/images/user.png";

// Validation schema for profile form
const profileSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().optional(),
  contact: z.string().optional(),
});

// Validation schema for password change form
const passwordSchema = z.object({
  oldpassword: z.string().min(6, "Password must be at least 6 characters"),
  newpassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmpassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newpassword === data.confirmpassword, {
  message: "Passwords do not match",
  path: ["confirmpassword"],
});

const reservedBooks = [
  { id: 1, name: "To Kill a Mockingbird", borrowedDate: "2024-03-01", returnedDate: "2024-03-15" },
  { id: 2, name: "1984", borrowedDate: "2024-02-20", returnedDate: "2024-03-05" },
];

const pendingBooks = [
  { id: 1, name: "The Great Gatsby", borrowedDate: "2024-03-10", returnedDate: "2024-03-20", daysOutside: 5, fine: "Rs.100" },
  { id: 2, name: "Pride and Prejudice", borrowedDate: "2024-02-25", returnedDate: "2024-03-05", daysOutside: 10, fine: "Rs.200" },
];

function Profile() {
  // Form instance for profile details
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      contact: "",
    },
  });

  // Form instance for password change
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    },
  });

  // Handlers
  const handleProfileSubmit = (data) => {
    console.log("Profile Form Data:", data);
  };

  const handlePasswordSubmit = (data) => {
    console.log("Password Change Form Data:", data);
  };

  return (
    <div>
      {/* Profile Section */}
      <section className="py-10 my-auto dark:bg-gray-900/70">
        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
          <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-2 dark:text-white">
              Hello, Marcus!
            </h1>
            <h2 className="text-gray-500 text-sm mb-4 dark:text-gray-400">
              Update your profile details
            </h2>

            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={userPng}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
                >
                  📷
                </label>
                <input type="file" id="profileImage" accept="image/*" className="hidden" />
              </div>
              <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                Click the icon to upload a new profile image
              </p>
            </div>

            {/* Profile Form */}
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact No</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your contact no" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="default" size="lg" className="w-full">
                  Update Profile
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Change Password Section */}
      <section className="py-10 my-auto dark:bg-gray-900/70">
        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-1">
          <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-2 dark:text-white">
              Change Password
            </h1>
            <h2 className="text-gray-500 text-sm mb-4 dark:text-gray-400">
              Update your password
            </h2>

            {/* Password Change Form */}
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="oldpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter old password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="default" size="lg" className="w-full">
                  Change Password
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Reserved Books Section */}
      <section className="py-10 my-auto dark:bg-gray-900/70">
        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-1">
          <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-2 dark:text-white">
              Reserved Books
            </h1>
            <h2 className="text-gray-500 text-sm mb-4 dark:text-gray-400">
              Books you have reserved
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 dark:bg-gray-800">Book Name</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Borrowed Date</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Returned Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reservedBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.name}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.borrowedDate}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.returnedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pending Books Section */}
      <section className="py-10 my-auto dark:bg-gray-900/70">
        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-1">
          <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-2 dark:text-white">
              Pending Books
            </h1>
            <h2 className="text-gray-500 text-sm mb-4 dark:text-gray-400">
              Books you have borrowed
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 dark:bg-gray-800">Book Name</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Borrowed Date</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Returned Date</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Days Outside</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.name}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.borrowedDate}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.returnedDate}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.daysOutside} days</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{book.fine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
