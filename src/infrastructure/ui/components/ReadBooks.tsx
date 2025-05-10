import React, { useContext } from 'react';
import { BooksContext } from '../context/BooksContext';
import BookItem from './BookItem';

/**
 * Component that displays the list of books that have been read
 */
const ReadBooks: React.FC = () => {
  const { readBooks } = useContext(BooksContext);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-teal-800">Books I've Read</h2>
      {readBooks.length === 0 ? (
        <p className="text-gray-600">You haven't read any books yet.</p>
      ) : (
        <ul className="space-y-4">
          {readBooks.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReadBooks;
