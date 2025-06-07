import React from 'react';
import { BookActionsProps } from './types';

/**
 * Componente para mostrar y gestionar las acciones disponibles para un libro
 */
const BookActions: React.FC<BookActionsProps> = ({ 
  book, 
  onToggleStatus, 
  onEditDates, 
  viewMode 
}) => {
  const { status } = book;

  // Botón para editar fechas de lectura
  const renderEditDatesButton = () => {
    if (status !== 'read') return null;
    
    return (
      <button
        className="text-teal-800 text-xs font-medium hover:bg-pink-50 px-2 py-1 rounded transition-colors flex items-center"
        onClick={onEditDates}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Reading Dates
      </button>
    );
  };

  // Botón para cambiar el estado del libro
  const renderToggleStatusButton = () => {
    if (viewMode === 'grid') {
      return status === 'read' ? (
        <button
          className="text-gray-600 text-xs font-medium border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors flex items-center"
          onClick={onToggleStatus}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Want to Read
        </button>
      ) : (
        <button
          className="text-teal-800 text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors flex items-center"
          onClick={onToggleStatus}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark as Read
        </button>
      );
    } else if (viewMode === 'list') {
      return status === 'read' ? (
        <button
          className="text-gray-600 text-xs font-medium border border-gray-200 px-2 py-0.5 rounded-full transition-colors flex items-center"
          onClick={onToggleStatus}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Want to Read
        </button>
      ) : (
        <button
          className="text-teal-800 text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full transition-colors flex items-center"
          onClick={onToggleStatus}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark as Read
        </button>
      );
    } else {
      // Compact view
      return status === 'read' ? (
        <button
          className="text-gray-600 text-xs font-medium border border-gray-200 px-2 py-0.5 rounded-full transition-colors flex items-center"
          onClick={onToggleStatus}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Want to Read
        </button>
      ) : (
        <button
          className="text-teal-800 text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full transition-colors flex items-center"
          onClick={onToggleStatus}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark as Read
        </button>
      );
    }
  };

  // Renderizar los botones según el modo de visualización
  if (viewMode === 'grid') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {renderEditDatesButton()}
        {renderToggleStatusButton()}
      </div>
    );
  } else if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-2">
        {renderEditDatesButton()}
        {renderToggleStatusButton()}
      </div>
    );
  }

  // Compact view
  return (
    <div className="flex items-center">
      {renderToggleStatusButton()}
    </div>
  );
};

export default BookActions;
