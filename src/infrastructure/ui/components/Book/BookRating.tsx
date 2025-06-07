import React from 'react';
import Rating from '@mui/material/Rating';
import { BookRatingProps } from './types';

/**
 * Componente para mostrar y gestionar la calificación de un libro
 */
const BookRating: React.FC<BookRatingProps> = ({ id, rating, onChange, size = 'medium' }) => {
  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    // Stop event propagation to prevent parent click handlers from firing
    event.stopPropagation();
    onChange(newValue);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Rating
        name={`rating-${id}`}
        value={rating || 0}
        precision={0.5}
        size={size}
        onChange={handleRatingChange}
      />
    </div>
  );
};

export default BookRating;
