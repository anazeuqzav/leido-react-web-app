import React from 'react';
import Rating from '@mui/material/Rating';
import { BookRatingProps } from './types';

/**
 * Componente para mostrar y gestionar la calificación de un libro
 */
const BookRating: React.FC<BookRatingProps> = ({ id, rating, onChange, size = 'medium' }) => {
  return (
    <div>
      <Rating
        name={`rating-${id}`}
        value={rating || 0}
        precision={0.5}
        size={size}
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
      />
    </div>
  );
};

export default BookRating;
