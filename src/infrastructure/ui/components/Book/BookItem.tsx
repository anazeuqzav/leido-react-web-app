import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BooksContext } from '../../context/BooksContext';
import BookDisplay from './BookDisplay';
import { BookItemProps } from './types';
import UpdateReadDateModal from '../modals/UpdateReadDateModal';
import AddBookDetailsModal from '../modals/AddBookDetailsModal';

/**
 * Component that displays a book item in a grid or list view.
 * @param props - The props for the component.
 * @returns The JSX for the component.
 */
const BookItem: React.FC<BookItemProps> = (props) => {
  const { id: initialId, viewMode = 'grid' } = props;
  const navigate = useNavigate();
  const { updateBook, deleteBook, getBookById } = useContext(BooksContext);
  const [showUpdateDateModal, setShowUpdateDateModal] = useState(false);
  const [showAddDetailsModal, setShowAddDetailsModal] = useState(false);

  const currentBook = getBookById(initialId) ?? props;

  // Handle delete book
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${currentBook.title}"?`)) {
      deleteBook(currentBook.id);
    }
  };

  // Handle view details
  const handleViewDetails = () => {
    navigate(`/library-book/${currentBook.id}`);
  };

  // Handle toggle status
  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentBook.status === 'to-read') {
      setShowAddDetailsModal(true);
      return;
    }
    updateBook(currentBook.id, {
      status: 'to-read',
      readDate: undefined
    });
  };

  // Handle rating change
  const handleRatingChange = (newValue: number | null) => {
    updateBook(currentBook.id, { rating: newValue || 0 });
  };

  // Handle edit dates
  const handleEditDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUpdateDateModal(true);
  };

  // Handle add details confirm
  const handleAddDetailsConfirm = (startDate: Date | null, readDate: Date | null, rating: number | null) => {
    updateBook(currentBook.id, {
      status: 'read',
      startDate: startDate || undefined,
      readDate: readDate || undefined,
      rating: rating || 0
    });
    setShowAddDetailsModal(false);
  };

  return (
    <>
      <BookDisplay
        book={currentBook}
        viewMode={viewMode}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onEditDates={handleEditDates}
        onRatingChange={handleRatingChange}
      />

      {showUpdateDateModal && (
        <UpdateReadDateModal
          book={currentBook}
          onClose={() => setShowUpdateDateModal(false)}

        />
      )}

      {showAddDetailsModal && (
        <AddBookDetailsModal
          isOpen={showAddDetailsModal}
          onClose={() => setShowAddDetailsModal(false)}
          onConfirm={handleAddDetailsConfirm}
        />
      )}
    </>
  );
};

export default BookItem;