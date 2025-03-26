import resetPasswordPng from "../assets/images/reset_password.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../components/mode-toggle";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

function Reset_password() {
  const { token } = useParams();
  const { resetPassword, loading } = useUserStore();
  const navigate = useNavigate();
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z
    .object({
      password: z
        .string()
        .regex(format, {
          message: "Password must contain at least one special character",
        })
        .min(8, {
          message: "Password must contain at least 8 characters",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    resetPassword(token, data.password, navigate);
  };
  return (
    <div className="min-h-screen grid sm:grid-cols-2 justify-center items-center gap-4">
      <div className="mx-auto hidden sm:block ">
        <img src={resetPasswordPng} alt="reset_password_img" />
      </div>
      <div className="mx-auto ">
        <ModeToggle />
        <div className="text-center my-6">
          <h1 className="text-4xl font-purple-purse">Reset Your Passowrd</h1>
          <h2 className="text-2xl font-poppins">
            Make sure to use a strong one
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter New Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoEyeOff className="h-5 w-5" />
                      ) : (
                        <IoEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter Confirm Password"
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <IoEyeOff className="h-5 w-5" />
                      ) : (
                        <IoEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
            >
              {} {loading ? "Loading..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Reset_password;
