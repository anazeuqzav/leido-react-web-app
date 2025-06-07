import React from 'react';
import Rating from '@mui/material/Rating';
import { BookRatingProps } from './types';

/**
 * Component that displays and manages a book's rating.
 */
const BookRating: React.FC<BookRatingProps> = ({ id, rating, onChange, size = 'medium' }) => {
  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
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
