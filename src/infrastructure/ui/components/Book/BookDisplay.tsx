import React from 'react';
import { BookDisplayProps } from './types';

/**
 * Componente que se encarga únicamente de mostrar la información del libro
 * según el modo de visualización seleccionado.
 */
const BookDisplay: React.FC<BookDisplayProps> = ({ book, viewMode, onViewDetails, children }) => {
  const { title, author, year, genre, cover } = book;

  // Grid view (default) - Card layout with image and details
  if (viewMode === 'grid') {
    return (
      <div 
        className="relative border-l-4 border-teal-600 p-4 rounded-lg bg-white shadow-md w-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] hover:border-l-8"
        onClick={onViewDetails}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Imagen del libro */}
          {cover && (
            <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 w-full max-w-[120px] sm:w-28">
              <div className="aspect-[3/4] w-full relative rounded-md shadow-sm overflow-hidden">
                <img
                  src={cover}
                  alt={`Cover of ${title}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Información del libro */}
          <div className="flex-1 flex flex-col text-left">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <div>
              <p className="text-sm text-gray-600 font-medium">{author} {year && `(${year})`}</p>
              {genre && (
                <span className="text-xs text-teal-800 bg-pink-50 inline-block mt-1 px-2 py-1 rounded-full border border-pink-100 font-medium">{genre}</span>
              )}
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
