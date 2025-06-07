import React from 'react';
import { Book } from '../../../../domain/entities/Book';

interface BookReadingDatesProps {
  book: Book;
}

/**
 * Componente para mostrar las fechas de lectura de un libro
 */
const BookReadingDates: React.FC<BookReadingDatesProps> = ({ book }) => {
  const { status, readDate, startDate } = book;
  
  if (status !== 'read') return null;
  
  const localReadDate = readDate ? new Date(readDate).toLocaleDateString() : 'Not finished';
  const localStartDate = startDate ? new Date(startDate).toLocaleDateString() : 'Not started';

  return (
    <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
      <p className="font-medium">Started:</p>
      <p className="font-normal">{localStartDate}</p>
      <p className="font-medium">Finished:</p>
      <p className="font-normal">{localReadDate}</p>
    </div>
  );
};

export default BookReadingDates;
