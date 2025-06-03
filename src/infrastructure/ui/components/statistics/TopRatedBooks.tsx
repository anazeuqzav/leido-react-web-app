import React from 'react';
import { BookRanking } from '../../../../domain/entities/Statistics';

interface TopRatedBooksProps {
  books: BookRanking[];
}

const TopRatedBooks: React.FC<TopRatedBooksProps> = ({ books }) => {
  // Sort books by rating (highest to lowest)
  const sortedBooks = [...books].sort((a, b) => b.rating - a.rating);
  
  // Function to display stars based on rating
  const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="space-y-4">
      {sortedBooks.map((book, index) => (
        <div key={book.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-800 font-bold">
              #{index + 1}
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <div className="mt-1 text-lg">
              {renderStars(book.rating)}
              <span className="ml-2 text-sm text-gray-600">({book.rating.toFixed(1)})</span>
            </div>
          </div>
          
          {book.cover && (
            <div className="flex-shrink-0 ml-4">
              <img 
                src={book.cover} 
                alt={`Portada de ${book.title}`} 
                className="w-16 h-24 object-cover rounded shadow-sm"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TopRatedBooks;
