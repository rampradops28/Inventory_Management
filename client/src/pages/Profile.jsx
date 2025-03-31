import { useEffect, useState } from "react";
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
import { useUserStore } from "@/stores/useUserStore";
import { useReservationStore } from "@/stores/useReservation";

function Profile() {
  const {
    reservations,
    loading: loadReservations,
    getUserReservations,
    getUserBorrowHistory,
    reservationHistory,
  } = useReservationStore();
  const { user, updateProfile, loading } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.image_url || userPng);

  useEffect(() => {
    getUserReservations();
    getUserBorrowHistory();
  }, []);

  const profileSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    email: z.string().email("Please enter a valid email"),
    address: z
      .string()
      .optional()
      .refine(
        (val) => {
          return val === undefined || val.length >= 10;
        },
        { message: "Address must be at least 10 characters" }
      ),
    contact: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || (val.length === 9 && /^\d+$/.test(val)),
        {
          message: "Contact number must be exactly 9 digits",
        }
      ),
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      address: user?.address,
      contact: user?.contact,
    },
    mode: "onChange",
  });

  const handleProfileSubmit = async (data) => {
    const { name, email, contact, address } = data;

    const image = profileImage !== user?.image_url ? profileImage : undefined;

    await updateProfile(name, email, contact, address, image);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const file = files[0];

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64Image = reader.result;
          setProfileImage(base64Image);
          resolve(base64Image);
        };

        reader.onerror = (error) => {
          console.error("Error converting image to base64:", error);
          reject(error);
        };
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {/* Profile Section */}
      <section className="py-10 my-auto dark:bg-gray-900/70">
        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
          <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-2 dark:text-white">
                  Hello, {user?.name}!
                </h1>
                <h2 className="text-gray-500 text-sm mb-4 dark:text-gray-400">
                  {isEditing
                    ? "Edit your profile details"
                    : "Your profile details"}
                </h2>
              </div>
              {!isEditing && (
                <Button variant="default" onClick={handleEditToggle}>
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
                    >
                      📷
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </>
                )}
              </div>
              {isEditing && (
                <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                  Click the icon to upload a new profile image
                </p>
              )}
            </div>

            {/* Profile Form */}
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          disabled={!isEditing}
                        />
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
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          disabled={!isEditing}
                        />
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
                        <Input
                          placeholder="Enter your address"
                          {...field}
                          disabled={!isEditing}
                        />
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
                        <Input
                          placeholder="Enter your contact no"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      className="w-full"
                    >
                      {loading ? "Loading..." : "Save Changes"}
                    </Button>
                  </div>
                )}
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
                    <th className="px-4 py-2 dark:bg-gray-800">
                      Reserved Date
                    </th>
                    <th className="px-4 py-2 dark:bg-gray-800">Return Date</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Is Overdive</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Status</th>
                    <th className="px-4 py-2 dark:bg-gray-800">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="border px-4 py-2 dark:border-gray-700">
                        {reservation.title}
                      </td>
                      <td className="border px-4 py-2 dark:border-gray-700">
                        {new Date(reservation.reservation_date).toDateString()}
                      </td>
                      <td className="border px-4 py-2 dark:border-gray-700">
                        {reservation.status === "borrowed"
                          ? new Date(
                              new Date(reservation.reservation_date).setDate(
                                new Date(
                                  reservation.reservation_date
                                ).getDate() + 7
                              )
                            ).toDateString()
                          : "Not Applicable"}
                      </td>
                      <td className="border px-4 py-2 dark:border-gray-700">
                        {reservation.status === "borrowed" &&
                        new Date() >
                          new Date(reservation.reservation_date).setDate(
                            new Date(reservation.reservation_date).getDate() + 7
                          )
                          ? "Overdue"
                          : "Not Applicable"}
                      </td>
                      <td className="border px-4 py-2 dark:border-gray-700">
                        {reservation.status}
                      </td>
                      <td className="border px-4 py-2 dark:border-gray-700">
                        {reservation.fine}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Borrowed Books Section */}
      <section className="py-10 my-auto dark:bg-gray-900/70">
        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-1">
          <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold mb-2 dark:text-white">
              Borrowed History
            </h1>
            <h2 className="text-gray-500 text-sm mb-4 dark:text-gray-400">
              Books you have borrowed
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 dark:bg-gray-800">Book Name</th>
                    <th className="px-4 py-2 dark:bg-gray-800">
                      Borrowed Date
                    </th>
                    <th className="px-4 py-2 dark:bg-gray-800">
                      Returned Date
                    </th>
                    <th className="px-4 py-2 dark:bg-gray-800">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {reservationHistory
                    .filter((borrowed) => borrowed.returned_date !== null) // Filter out records with null return date
                    .map((borrowed) => (
                      <tr key={borrowed.borrow_id}>
                        <td className="border px-4 py-2 dark:border-gray-700">
                          {borrowed.title}
                        </td>
                        <td className="border px-4 py-2 dark:border-gray-700">
                          {new Date(borrowed.borrowed_date).toDateString()}
                        </td>
                        <td className="border px-4 py-2 dark:border-gray-700">
                          {new Date(borrowed.returned_date).toDateString()}
                        </td>
                        <td className="border px-4 py-2 dark:border-gray-700">
                          {borrowed.fine}
                        </td>
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
