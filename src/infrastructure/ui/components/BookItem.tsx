import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  id: initialId, 
  title: initialTitle, 
  author: initialAuthor, 
  year: initialYear, 
  genre: initialGenre, 
  status: initialStatus, 
  rating: initialRating, 
  cover: initialCover, 
  userId: initialUserId, 
  readDate: initialReadDate,
  startDate: initialStartDate
}) => {
  const navigate = useNavigate();
  const { updateBook, deleteBook, getBookById, books } = useContext(BooksContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  
  // Usar un estado para mantener el ID actualizado del libro
  const [currentBookId, setCurrentBookId] = useState<string>(initialId);
  
  // Estado para manejar las ediciones del libro
  const [editedBook, setEditedBook] = useState<Book>({
    id: initialId,
    title: initialTitle,
    author: initialAuthor,
    year: initialYear,
    genre: initialGenre,
    status: initialStatus,
    rating: initialRating,
    cover: initialCover,
    userId: initialUserId,
    readDate: initialReadDate,
    startDate: initialStartDate,
    externalId: undefined
  });
  
  // Obtener siempre la versión más actualizada del libro desde el contexto
  const currentBook = getBookById(currentBookId) || {
    id: initialId,
    title: initialTitle,
    author: initialAuthor,
    year: initialYear,
    genre: initialGenre,
    status: initialStatus,
    rating: initialRating,
    cover: initialCover,
    userId: initialUserId,
    readDate: initialReadDate,
    startDate: initialStartDate,
    externalId: undefined
  };
  
  // Actualizar el ID si el libro ha cambiado en el contexto
  useEffect(() => {
    // Buscar el libro por su título y autor para encontrarlo incluso si el ID cambió
    const matchingBook = books.find(book => 
      book.title === initialTitle && 
      book.author === initialAuthor &&
      book.id !== currentBookId
    );
    
    if (matchingBook) {
      console.log(`Libro encontrado con nuevo ID: ${matchingBook.id} (anterior: ${currentBookId})`);
      setCurrentBookId(matchingBook.id);
    }
  }, [books, initialTitle, initialAuthor, currentBookId]);
  
  // Actualizar editedBook cuando currentBook cambia
  useEffect(() => {
    setEditedBook(currentBook);
  }, [currentBook]);
  
  // Extraer propiedades del libro actual para usar en el componente
  const {
    id,
    title,
    author,
    year,
    genre,
    status,
    rating,
    cover,
    userId,
    readDate,
    startDate
  } = currentBook;
  
  const localReadDate = readDate ? new Date(readDate).toLocaleDateString() : 'No finalizado';
  const localStartDate = startDate ? new Date(startDate).toLocaleDateString() : 'No iniciado';

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
      ...currentBook,
      status: newStatus,
      rating: newStatus === 'read' ? currentBook.rating : undefined,
    });
  };

  // Navegar a la página de detalles del libro
  const handleViewDetails = (event: React.MouseEvent) => {
    // Evitar que el clic se propague a los botones internos
    if ((event.target as HTMLElement).closest('button, .MuiRating-root')) {
      return;
    }
    navigate(`/library-book/${id}`);
  };

  const renderBookItem = () => (
    <li 
      className="flex items-center border border-teal-800 p-4 rounded-lg bg-white shadow-md w-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleViewDetails}
    >
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
        <div className="text-sm text-gray-600">
          {status === 'read' && (
            <>
              <p>Inicio: {localStartDate}</p>
              <p>Finalización: {localReadDate}</p>
            </>
          )}
        </div>
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
            onClick={(e) => {
              e.stopPropagation();
              setShowDateModal(true);
            }}
          >
            Editar fechas de lectura
          </button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus();
            }}
            className="bg-teal-600 text-white hover:bg-teal-700"
          >
            {status === 'read' ? 'Want to read' : 'Mark as read'}
          </Button>
        </div>
      </div>
      <IconButton
        color="secondary"
        aria-label="delete"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="self-end"
        style={{ alignSelf: 'flex-end' }}
      >
        <DeleteIcon />
      </IconButton>
    </li>
  );

  return (
    <>
      {showDateModal && (
        <ReadDateModal
          book={currentBook}
          onClose={() => setShowDateModal(false)}
          onBookUpdated={(updatedBookId) => {
            // Actualizar el ID del libro si ha cambiado después de la actualización
            if (updatedBookId && updatedBookId !== currentBookId) {
              console.log(`Actualizando ID del libro después de editar fechas: ${currentBookId} -> ${updatedBookId}`);
              setCurrentBookId(updatedBookId);
            }
          }}
        />
      )}
      {renderBookItem()}
    </>
  );
};

export default BookItem;
