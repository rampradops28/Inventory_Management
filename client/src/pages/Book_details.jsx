import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Atom, Library, ScrollText } from "lucide-react";

const BookDetails = () => {
  const [categories] = useState([
    {
      id: 1,
      name: "Fiction",
      description: "Explore fictional books",
      icon: BookOpen,
    },
    {
      id: 2,
      name: "Non-Fiction",
      description: "Explore non-fictional books",
      icon: ScrollText,
    },
    {
      id: 3,
      name: "Science",
      description: "Explore science books",
      icon: Atom,
    },
    {
      id: 4,
      name: "History",
      description: "Explore history books",
      icon: Library,
    },
  ]);

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/book-category/${categoryName}`);
  };

  return (
    <div className="m-4 dark:bg-gray-900 dark:text-gray-300 transition-colors duration-300 px-5 pt-5 pb-10 rounded-2xl shadow-lg ">
      <div className="mt-10 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white font-purple-purse">
          Book Categories
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 font-poppins">
          Explore our wide range of book categories
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardHeader className="flex flex-col items-center">
                  <CategoryIcon
                    className="w-12 h-12 text-primary mb-4 
                    group-hover:text-primary-foreground 
                    transition-colors duration-300"
                  />
                  <CardTitle className="text-gray-900 dark:text-white text-xl">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-700 dark:text-gray-300 mb-4">
                    {category.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.name);
                    }}
                  >
                    Explore Category
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
