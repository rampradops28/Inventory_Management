import React from "react";
import forgetPasswordPng from "../assets/images/forget_password.png";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../components/mode-toggle";
import { useUserStore } from "@/stores/useUserStore";
function Forget_password() {
  const { forgetPassword, loading } = useUserStore();
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    forgetPassword(data.email, navigate);
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2  justify-center items-center">
      <div className="mx-auto hidden sm:block ">
        <img src={forgetPasswordPng} alt="forget_password_img" />
      </div>
      <div className="mx-auto">
        <ModeToggle />
        <div className="text-center my-6">
          <h1 className="font-purple-purse text-4xl">Forget Your Password ?</h1>
          <h2 className="font-poppins text-2xl">
            Dont't worry, reset your password
          </h2>
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
                  <FormDescription>
                    We will send a password reset link to your email
                  </FormDescription>
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
              {loading ? "Loading..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Forget_password;
