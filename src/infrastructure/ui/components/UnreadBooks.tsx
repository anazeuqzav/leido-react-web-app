import React, { useContext } from 'react';
import { BooksContext } from '../context/BooksContext';
import BookItem from './BookItem';

/**
 * Component that displays the list of books that are to be read
 */
const UnreadBooks: React.FC = () => {
  const { unreadBooks } = useContext(BooksContext);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-teal-800">Books To Read</h2>
      {unreadBooks.length === 0 ? (
        <p className="text-gray-600">You don't have any books in your reading list yet.</p>
      ) : (
        <ul className="space-y-4">
          {unreadBooks.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnreadBooks;
