import React, { useState, useContext } from 'react';
import { Book } from '../../../domain/entities/Book';
import { BooksContext } from '../context/BooksContext';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import ReadDateModal from './ReadDateModal';

interface BookItemProps extends Book {}

/**
 * Component that represents an individual book in the list of books.
 * Allows editing, deleting, and marking a book as read/unread, as well as displaying its information.
 */
const BookItem: React.FC<BookItemProps> = ({ 
  id, 
  title, 
  author, 
  year, 
  genre, 
  status, 
  rating, 
  cover, 
  userId, 
  readDate 
}) => {
  const { updateBook, deleteBook } = useContext(BooksContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedBook, setEditedBook] = useState<Book>({ 
    id, 
    title, 
    author, 
    year, 
    genre, 
    status, 
    rating, 
    cover, 
    userId, 
    readDate 
  });

  const localDate = readDate ? new Date(readDate).toLocaleDateString() : 'Not read yet';

  // Update the edited book and exit edit mode
  const handleSave = () => {
    updateBook(id, editedBook);
    setIsEditing(false);
  };

  // Handle book deletion, showing a confirmation window
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBook(id);
    }
  };

  // Function to mark a book as read or unread
  const handleToggleStatus = () => {
    const newStatus = status === 'read' ? 'to-read' : 'read';

    updateBook(id, {
      ...editedBook,
      status: newStatus,
      rating: newStatus === 'read' ? editedBook.rating : undefined,
    });
  };

  return (
    <li className="flex items-center border border-teal-800 p-4 rounded-lg bg-white shadow-md w-full">
      {cover && (
        <img
          src={cover}
          alt={`Cover of ${title}`}
          className="w-28 h-40 object-cover rounded border border-gray-300 mr-4"
        />
      )}
      <div className="flex-1 flex flex-col gap-1 text-left">
        <p className="text-base font-bold text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{author} ({year})</p>
        <p className="text-sm text-gray-600">{genre}</p>
        <p className="text-sm text-gray-600">Read date: {localDate}</p>
        {status === 'read' && (
          <div className="mt-1">
            <Rating
              name={`rating-${id}`}
              value={editedBook.rating || 0}
              precision={0.5}
              onChange={(_, newValue) => {
                setEditedBook({ ...editedBook, rating: newValue || 0 });
                updateBook(id, { ...editedBook, rating: newValue || 0 });
              }}
            />
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            className="text-teal-600 text-xs font-medium hover:underline"
            onClick={() => setIsEditing(true)}
          >
            Edit read date
          </button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleToggleStatus}
            className="bg-teal-600 text-white hover:bg-teal-700"
          >
            {status === 'read' ? 'Want to read' : 'Mark as read'}
          </Button>
        </div>
      </div>
      <IconButton
        color="secondary"
        aria-label="delete"
        onClick={handleDelete}
        className="self-end"
        style={{ alignSelf: 'flex-end' }}
      >
        <DeleteIcon />
      </IconButton>

      {/* Material-UI Modal */}
      <ReadDateModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        readDate={editedBook.readDate}
        onChange={(newDate) => setEditedBook({ ...editedBook, readDate: newDate })}
        onSave={handleSave}
      />
    </li>
  );
};

export default BookItem;
