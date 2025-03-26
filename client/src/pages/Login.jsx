import { useState } from "react";
import loginPng from "../assets/images/login.png";
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
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // schema for form validation
  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(4, {
      message: "Please enter your password",
    }),
  });

  // Initialize the form with react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle submission
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2 mx-auto justify-center items-center px-4">
      <div className="mx-auto hidden sm:block">
        <img src={loginPng} alt="login" className="max-w-full h-auto" />
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex">
            <ModeToggle />
          </div>
          <h1 className="font-purple-purse text-4xl mb-2">Oh, You're back!</h1>
          <h2 className="font-poppins text-2xl ">
            Log in with your credentials
          </h2>
        </div>
        <div>
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

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
              >
                Login
              </Button>
            </form>
            <div className="flex mt-5 gap-5 justify-between mb-4">
              <div className="flex">
                <div>Not a member ?</div>
                <div
                  className="ml-2 cursor-pointer hover:underline "
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </div>
              </div>
              <div
                className="cursor-pointer text-red-400 hover:underline"
                onClick={() => navigate("/forget-password")}
              >
                Forget Password ?
              </div>
            </div>
            <div className="flex items-center justify-center w-full my-4">
              <span className="flex-1 border-t border-gray-300"></span>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <span className="flex-1 border-t border-gray-300"></span>
            </div>

            <div className="social-login-buttons">
              <button className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <img
                  src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                  alt="Google"
                  width="20"
                  className="h-5 w-5"
                />
                <span>Sign up with Google</span>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
