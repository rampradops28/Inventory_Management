import React from "react";
import { FaBook, FaUsers, FaCogs } from "react-icons/fa";

function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1
            className="text-5xl md:text-6xl font-semibold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About Us
          </h1>
          <p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Welcome to our Library Management System
          </p>
        </div>

        {/* About Us Image Section */}
        <div className="mb-16 text-center">
          <img
            src="https://www.blogtyrant.com/wp-content/uploads/2011/02/best-about-us-pages.png"
            alt="About Us"
            className="w-full max-w-4xl mx-auto h-64 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Mission & Vision Section */}
        <div className="grid sm:grid-cols-3 gap-8 mb-16">
          {/* Mission */}
          <div className="flex flex-col items-center p-8 bg-gray-300 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <FaBook className="text-6xl mb-6 text-blue-600 dark:text-blue-400" />
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Mission
            </h2>
            <p className="text-center text-gray-800 dark:text-gray-300">
              Our mission is to provide a comprehensive, efficient, and
              user-friendly library management system for seamless book
              tracking, lending, and administration.
            </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col items-center p-8 bg-gray-300 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <FaUsers className="text-6xl mb-6 text-blue-600 dark:text-blue-400" />
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Vision
            </h2>
            <p className="text-center text-gray-800 dark:text-gray-300">
              Our vision is to revolutionize the library experience by
              integrating technology to enhance user interaction, accessibility,
              and resource management.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="flex flex-col items-center p-8 bg-gray-300 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <FaCogs className="text-6xl mb-6 text-blue-600 dark:text-blue-400" />
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Why Choose Us?
            </h2>
            <p className="text-center text-gray-800 dark:text-gray-300">
              We offer innovative solutions for managing library resources,
              easy-to-use interfaces, and personalized features that help
              streamline library operations and improve user experience.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2
            className="text-3xl font-semibold mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Meet the Team
          </h2>
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <img
                src="https://icon2.cleanpng.com/20180403/ape/kisspng-computer-icons-businessperson-clip-art-bussines-5ac3d947bc09b4.6464791915227845837702.jpg"
                alt="Team Member"
                className="rounded-full w-40 h-40 mb-4 mx-auto"
              />
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-gray-600 dark:text-gray-300">Lead Developer</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-6">What Our Users Say</h2>
          <div className="max-w-xl mx-auto">
            <p className="italic text-gray-600 dark:text-gray-300">
              "The Library Management System has transformed how we manage our
              collections. It's intuitive, efficient, and makes book tracking a
              breeze!"
            </p>
            <p className="font-semibold mt-2">– Jane Doe, Library Manager</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-100 dark:bg-gray-800 py-12 px-6 rounded-xl max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="p-4 bg-gray-300 dark:bg-gray-700 shadow rounded-lg">
              <h3 className="font-medium text-lg">How do I borrow books?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Simply log in, search for a book, and click "Borrow" to check it
                out.
              </p>
            </div>
            <div className="p-4 bg-gray-300 dark:bg-gray-700 shadow rounded-lg">
              <h3 className="font-medium text-lg">Can I reserve a book?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Yes, our system allows you to reserve books online and get
                notified once they are available.
              </p>
            </div>
            <div className="p-4 bg-gray-300 dark:bg-gray-700 shadow rounded-lg">
              <h3 className="font-medium text-lg">How do I return a book?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                You can return books by visiting the library and scanning the
                book's barcode at the return station.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
