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

function Profile() {
  const formSchema = z.object({
    name: z.string().min(5, {
      message: "Name must be at least 5 characters",
    }),

    emails: z.string().email({
      message: "Please enter a valid email address",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <section className="py-10 my-auto dark:bg-gray-900/70 min-h-screen">
      <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4 ">
        <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
          <h1 className="lg:text-3xl md:text-2xl text-xl  font-extrabold mb-2 dark:text-white font-purple-purse">
            Hello, Marcus!
          </h1>
          <h2 className="text-grey text-sm mb-4 dark:text-gray-400 font-poppins">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.75 10.5h.008v.008h-.008z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-8.426c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316a2.31 2.31 0 01-1.64 1.055c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
              Click the icon to upload a new profile image
            </p>
          </div>

          {/* Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
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

              {/* Email Field */}
              <FormField
                control={form.control}
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

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
              >
                Edit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default Profile;
