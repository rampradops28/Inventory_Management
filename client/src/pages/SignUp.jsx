import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
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
import signupPng from "../assets/images/signup.png";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import GoogleOAuth from "@/components/GoogleOAuth";

function SignUp() {
  const { signup, loading } = useUserStore();
  const navigate = useNavigate();
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z
    .object({
      email: z
        .string()
        .email({ message: "Please enter a valid email address" }),
      password: z
        .string()
        .regex(format, {
          message: "Password must contain at least one special character",
        })
        .min(8, { message: "Password must contain at least 8 characters" }),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords must match",
      path: ["confirm_password"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", confirm_password: "" },
  });

  const onSubmit = (data) => {
    signup(data.email, data.password, navigate);
  };

  const handleGoogleLogin = () => {
    console.log("Google Sign Up Clicked");
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2 mx-auto justify-center items-center px-4">
      <div className="mx-auto hidden sm:block">
        <img src={signupPng} alt="login" className="max-w-full h-auto" />
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex">
            <ModeToggle />
          </div>
          <h1 className="font-purple-purse text-4xl mb-2">Hello There!</h1>
          <h2 className="font-poppins text-2xl">Register an account with us</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter your Password"
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
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter your confirm Password"
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

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <div className="flex mt-5 mb-4">
            <div>Already a member?</div>
            <div
              className="ml-1 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </div>
          </div>

          <div className="flex items-center justify-center w-full my-4">
            <span className="flex-1 border-t border-gray-300"></span>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <span className="flex-1 border-t border-gray-300"></span>
          </div>

          <GoogleOAuth />
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
