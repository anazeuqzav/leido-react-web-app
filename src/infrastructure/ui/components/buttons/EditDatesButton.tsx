import React from "react";

interface EditDatesButtonProps {
    status: string;
    onEditDates: (e: React.MouseEvent) => void;
}

const EditDatesButton = ({ status, onEditDates }: EditDatesButtonProps) => {
    if (status !== 'read') return null;
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEditDates(e);
    };
    
    return (
      <button
        className="text-teal-800 text-[10px] sm:text-xs font-medium hover:bg-pink-50 px-1.5 py-0.5 rounded transition-colors flex items-center mb-1 mr-1 flex-shrink-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap border border-teal-100"
        onClick={handleClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span className="truncate">Edit Dates</span>
      </button>
    );
  };

export default EditDatesButton;
