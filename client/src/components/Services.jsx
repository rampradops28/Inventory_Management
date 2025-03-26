import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ServiceCard = ({ title, description, icon }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex items-center justify-center pb-2">
        <div className="text-6xl mb-4">{icon}</div>
      </CardHeader>
      <CardContent className="text-center">
        <CardTitle className="text-xl text-gray-900 dark:text-white mb-2">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Book Borrowing",
      description:
        "Borrow books from our extensive collection of thousands of books.",
      icon: "📖",
    },
    {
      id: 2,
      title: "Online Reservations",
      description: "Reserve books online and pick them up at your convenience.",
      icon: "🖥️",
    },
    {
      id: 3,
      title: "Study Spaces",
      description:
        "Quiet study spaces available for individual or group study.",
      icon: "🏫",
    },
  ];

  return (
    <section
      id="services"
      className="my-12 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-15 rounded-2xl "
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center font-purple-purse">
        Our Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default Services;
