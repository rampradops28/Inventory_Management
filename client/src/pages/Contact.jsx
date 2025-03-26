import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "emailjs-com";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Phone, Mail, MapPin } from "lucide-react";

// Ensure Textarea is properly imported
import { Textarea } from "../components/ui/textarea"; // Use relative path

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters" }),
});

function Contact() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = (data) => {
    setLoading(true);
    emailjs
      .send("service_h9zrqum", "template_4s8222h", data, "4Z17ZOGgVQQjOzql-")
      .then(() => {
        alert("Message sent successfully!");
        form.reset();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4 font-sans">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-sans">
            We'd love to hear from you! Fill out the form below, and we'll get
            back to you as soon as possible.
          </p>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="flex items-center text-lg">
              <Phone className="mr-3 text-blue-700 dark:text-blue-400" /> (+84)
              123 456 789
            </p>
            <p className="flex items-center text-lg">
              <Mail className="mr-3 text-blue-700 dark:text-blue-400" />{" "}
              contact.bookscart@gmail.com
            </p>
            <p className="flex items-center text-lg">
              <MapPin className="mr-3 text-blue-700 dark:text-blue-400" /> 227
              East 42nd St, New York, NY 1007
            </p>
          </div>
          <div className="relative hidden md:block mt-6">
            <img
              src="https://img.freepik.com/free-vector/contact-us-concept-illustration_114360-3147.jpg?ga=GA1.1.183559483.1742933020&semt=ais_hybrid"
              alt="Contact Us"
              className="rounded-lg object-cover h-[400px] w-full shadow-lg dark:shadow-gray-800"
            />
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-gray-700">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          className="border-0 bg-gray-100 dark:bg-gray-700 dark:text-white h-12 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="border-0 bg-gray-100 dark:bg-gray-700 dark:text-white h-12 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your message"
                          className="min-h-[120px] border-0 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 text-white h-12 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
