import React, { useContext } from 'react';
import { BooksContext } from '../context/BooksContext';
import BookItem from './BookItem';

/**
 * Component that displays the list of favorite books (rated 5 stars)
 */
const FavoriteBooks: React.FC = () => {
  const { favoriteBooks } = useContext(BooksContext);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-teal-800">Favorite Books</h2>
      {favoriteBooks.length === 0 ? (
        <p className="text-gray-600">You don't have any favorite books yet.</p>
      ) : (
        <ul className="list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteBooks.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteBooks;
