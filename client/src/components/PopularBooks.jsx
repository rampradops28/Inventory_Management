import React from 'react';
import BookCover from '../assets/images/book_cover.jpeg'

const BookCard = ({ title, author, cover }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {cover ? (
          <img src={cover} alt={title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-500">No Cover</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{author}</p>
        <button className="mt-3 w-full bg-blue-600 text-white py-1 rounded-md text-sm hover:bg-blue-700">
          Borrow
        </button>
      </div>
    </div>
  );
};

const PopularBooks = () => {
  //dummy data
  const books = [
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: BookCover },
    { id: 2, title: '1984', author: 'George Orwell', cover: BookCover },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: BookCover },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', cover: BookCover },
    { id: 5, title: 'Moby-Dick', author: 'Herman Melville', cover: BookCover },
    { id: 6, title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: BookCover },
    { id: 7, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', cover: BookCover },
    { id: 8, title: 'Brave New World', author: 'Aldous Huxley', cover: BookCover },

  ];

  return (
    <section id="books" className="my-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard 
            key={book.id}
            title={book.title}
            author={book.author}
            cover={book.cover}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularBooks;