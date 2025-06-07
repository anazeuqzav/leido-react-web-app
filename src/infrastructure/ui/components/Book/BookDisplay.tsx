import React, { ReactNode } from 'react';
import { Book } from '../../../../domain/entities/Book';
import BookRating from './BookRating';
import BookActions from './BookActions';
import BookReadingDates from './BookReadingDates';

export interface BookDisplayProps {
  book: Book;
  viewMode?: 'grid' | 'list' | 'compact';
  onViewDetails?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  onToggleStatus?: (e: React.MouseEvent) => void;
  onEditDates?: (e: React.MouseEvent) => void;
  onRatingChange?: (newValue: number | null) => void;
  children?: ReactNode;
}

/**
 * Componente que se encarga únicamente de mostrar la información del libro
 * según el modo de visualización seleccionado.
 */
const BookDisplay: React.FC<BookDisplayProps> = ({
  book,
  viewMode = 'grid', // por defecto
  onViewDetails,
  onDelete,
  onToggleStatus,
  onEditDates,
  onRatingChange,
  children
}) => {
  const { title, author, year, genre, cover, status } = book;

  // Grid view (default) - Card layout with image and details
  if (viewMode === 'grid') {
    return (
      <div className="relative mb-3">
        <div className="relative">
          {/* Delete button */}
          {onDelete && (
            <div className="absolute top-1 right-1 z-10 pointer-events-auto">
              <button
                aria-label="delete"
                onClick={onDelete}
                className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}

          {/* Main book content */}
          <div 
            className="relative border-l-3 border-teal-600 p-3 rounded-md bg-white shadow-sm w-full cursor-pointer transition-all duration-300 hover:shadow-md hover:border-l-6"
            onClick={onViewDetails}
          >
            <div className="flex flex-row">
              {/* Book cover */}
              {book.cover && (
                <div className="mr-4 flex-shrink-0">
                  <img
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    className="w-24 h-36 object-cover rounded-md shadow-sm"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Book info */}
              <div className="flex-1 flex flex-col text-left min-w-0">
                <h3 className="text-base font-bold text-gray-800 mb-1 truncate">
                  {book.title}
                </h3>
                
                <div>
                  <p className="text-xs text-gray-600 font-medium truncate">
                    {book.author} {book.year && `(${book.year})`}
                  </p>
                  {book.genre && (
                    <span className="text-xs text-teal-800 bg-pink-50 inline-block mt-1 px-1.5 py-0.5 rounded-full border border-pink-100 font-medium truncate">
                      {book.genre}
                    </span>
                  )}
                  
                  {/* Reading dates */}
                  {status === 'read' && (
                    <div className="mt-1 w-full">
                      <BookReadingDates book={book} />
                    </div>
                  )}
                  
                  {/* Rating */}
                  {status === 'read' && onRatingChange && (
                    <div className="mt-2">
                      <BookRating 
                        id={book.id} 
                        rating={book.rating} 
                        onChange={onRatingChange}
                        size="small"
                      />
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="mt-2">
                  <BookActions 
                    book={book} 
                    viewMode={viewMode}
                    onToggleStatus={onToggleStatus}
                    onEditDates={onEditDates}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view - Horizontal layout with more details
  if (viewMode === 'list') {
    return (
      <div 
        className="relative border-l-4 border-teal-600 p-4 rounded-lg bg-white shadow-sm w-full cursor-pointer transition-all duration-300 hover:shadow-md hover:border-l-8"
        onClick={onViewDetails}
      >
        <div className="flex flex-col sm:flex-row sm:items-start">
          {/* Imagen del libro */}
          {cover && (
            <div className="flex-shrink-0 w-full max-w-[100px] sm:w-16 mb-4 sm:mb-0 sm:mr-5 overflow-hidden rounded">
              <div className="aspect-[3/4] w-full relative">
                <img 
                  src={cover} 
                  alt={`Cover of ${title}`} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Información del libro */}
          <div className="flex-1 flex flex-col text-left min-w-0">
            <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
            <div className="mb-2">
              <div className="text-sm text-gray-600 font-medium">
                <span>{author}</span>
                {year && <span> ({year})</span>}
              </div>
              {genre && (
                <span className="text-xs text-teal-800 bg-pink-50 inline-block mt-1 px-2 py-0.5 rounded-full border border-pink-100 font-medium">{genre}</span>
              )}
            </div>
            
            {/* Espacio para acciones */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    );
  }

  // Compact view - Minimal horizontal layout
  return (
    <div 
      className="relative flex items-center py-3 px-4 w-full cursor-pointer transition-all duration-200 hover:bg-gray-50"
      onClick={onViewDetails}
    >
      <div className="flex items-center w-full">
        <div className="flex-1 mr-4">
          <h3 className="text-base font-medium text-gray-800 mb-1">{title}</h3>
          <div>
            <p className="text-sm text-gray-600">{author} {year && `(${year})`}</p>
            {genre && (
              <span className="text-xs text-teal-800 bg-pink-50 inline-block mt-1 px-2 py-0.5 rounded-full border border-pink-100 font-medium">{genre}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDisplay;
