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
    <div className="flex flex-col text-xs text-gray-600 bg-gray-50 p-1.5 rounded-md overflow-hidden w-full max-w-xs">
      <div className="flex">
        <p className="font-medium text-[10px] sm:text-xs w-16 flex-shrink-0">Started:</p>
        <p className="font-normal truncate text-[10px] sm:text-xs">{localStartDate}</p>
      </div>
      <div className="flex">
        <p className="font-medium text-[10px] sm:text-xs w-16 flex-shrink-0">Finished:</p>
        <p className="font-normal truncate text-[10px] sm:text-xs">{localReadDate}</p>
      </div>
    </div>
  );
};

export default BookReadingDates;
