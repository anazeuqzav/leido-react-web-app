import React from 'react';
import { ToggleStatusButtonProps } from './types';

/**
 * Component for toggling the status of a book (read or want to read)
 */
const ToggleStatusButton: React.FC<ToggleStatusButtonProps & { viewMode: 'grid' | 'list' | 'compact' }> = ({
  status,
  onToggleStatus,
  viewMode
}) => {

  // Handle click to toggle status
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleStatus(e);
  };

  // Render different buttons based on view mode
  if (viewMode === 'grid') {
    return status === 'read' ? (
      <button
        className="text-gray-600 text-[10px] sm:text-xs font-medium border border-gray-300 hover:bg-gray-50 px-2 py-0.5 rounded-full transition-colors flex items-center mb-1 mr-1 flex-shrink-0 max-w-full overflow-hidden"
        onClick={handleClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span className="truncate">Want to Read</span>
      </button>
    ) : (
      <button
        className="text-teal-800 text-[10px] sm:text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full transition-colors flex items-center mb-1 mr-1 flex-shrink-0 max-w-full overflow-hidden"
        onClick={handleClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="truncate">Mark as Read</span>
      </button>
    );
  } else if (viewMode === 'list') {
    return status === 'read' ? (
      <button
        className="text-gray-600 text-[10px] sm:text-xs font-medium border border-gray-200 px-2 py-0.5 rounded-full transition-colors flex items-center"
        onClick={handleClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Want to Read
      </button>
    ) : (
      <button
        className="text-teal-800 text-[10px] sm:text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full transition-colors flex items-center"
        onClick={handleClick}
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
        className="text-gray-600 text-[10px] sm:text-xs font-medium border border-gray-300 hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors flex items-center mb-1 mr-1 flex-shrink-0 max-w-full overflow-hidden"
        onClick={handleClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="truncate">Want to Read</span>
      </button>
    ) : (
      <button
        className="text-teal-800 text-[10px] sm:text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-1.5 py-0.5 rounded transition-colors flex items-center mb-1 mr-1 flex-shrink-0 max-w-full overflow-hidden"
        onClick={handleClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="truncate">Mark as Read</span>
      </button>
    );
  }
};

export default ToggleStatusButton;
