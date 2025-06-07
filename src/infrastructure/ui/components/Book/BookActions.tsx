import React from 'react';
import { BookActionsProps } from './types';
import EditDatesButton from '../buttons/EditDatesButton';
import ToggleStatusButton from '../buttons/ToggleStatusButton';

/**
 * Component to display and manage available actions for a book: edit dates and toggle status
 */
const BookActions: React.FC<BookActionsProps> = ({
  book,
  onToggleStatus,
  onEditDates,
  viewMode
}) => {
  // Handler for toggle status
  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus(e);
    }
  };

  // Handler for edit dates
  const handleEditDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditDates) {
      onEditDates(e);
    }
  };

  // Render buttons based on view mode
  if (viewMode === 'grid') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <EditDatesButton
          status={book.status}
          onEditDates={handleEditDates}
        />
        <ToggleStatusButton
          status={book.status}
          onToggleStatus={handleToggleStatus}
          viewMode="grid"
        />
      </div>
    );
  } else if (viewMode === 'list') {
    return (
      <div className="flex flex-wrap gap-2">
        <EditDatesButton
          status={book.status}
          onEditDates={handleEditDates}
        />
        <ToggleStatusButton
          status={book.status}
          onToggleStatus={handleToggleStatus}
          viewMode="list"
        />
      </div>
    );
  }

  // Compact view
  return (
    <div className="flex items-center">
      <ToggleStatusButton
        status={book.status}
        onToggleStatus={handleToggleStatus}
        viewMode="compact"
      />
    </div>
  );
};

export default BookActions;
