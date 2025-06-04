import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../../domain/entities/Book';
import { BooksContext } from '../context/BooksContext';
import { toast } from 'react-toastify';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import ReadDateModal from './ReadDateModal';

interface BookItemProps extends Book {
  viewMode?: 'grid' | 'list' | 'compact';
}

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
  startDate: initialStartDate,
  viewMode = 'grid'
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
  
  const localReadDate = readDate ? new Date(readDate).toLocaleDateString() : 'Not finished';
  const localStartDate = startDate ? new Date(startDate).toLocaleDateString() : 'Not started';

  // Handle book deletion, showing a confirmation window
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBook(id);
    }
  };

  // Function to mark a book as read or unread
  const handleToggleStatus = () => {
    // Si el libro está en estado 'to-read' y se va a marcar como leído,
    // mostrar el modal para añadir fechas y puntuación
    if (status === 'to-read') {
      setShowDateModal(true);
      return;
    }
    
    // Si el libro está en estado 'read' y se va a marcar como 'to-read'
    const newStatus = 'to-read';
    
    // Prepare update data based on the new status
    const updateData: Partial<Book> = {
      status: newStatus,
      readDate: undefined // Eliminar la fecha de lectura
    };
    
    console.log(`Changing book status from ${status} to ${newStatus}`, updateData);
    
    updateBook(id, updateData).then(() => {
      toast.success(`"${title}" has been added to your want to read list!`);
    }).catch(error => {
      console.error('Error updating book status:', error);
      toast.error('Failed to update book status. Please try again.');
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

  const renderBookItem = () => {
    // Grid view (default) - Card layout with image and details
    if (viewMode === 'grid') {
      return (
        <li 
          className="relative flex flex-col sm:flex-row items-start sm:items-center border-l-4 border-teal-600 p-4 rounded-lg bg-white shadow-md w-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] hover:border-l-8"
          onClick={handleViewDetails}
        >
      {cover && (
        <div className="mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
          <img
            src={cover}
            alt={`Cover of ${title}`}
            className="w-full sm:w-28 h-40 object-cover rounded-md shadow-sm"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col gap-1 text-left">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 font-medium">{author} {year && `(${year})`}</p>
        {genre && <p className="text-xs text-teal-800 bg-pink-50 inline-block px-2 py-1 rounded-full border border-pink-100 font-medium">{genre}</p>}
        
        {status === 'read' && (
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
            <p className="font-medium">Started:</p>
            <p>{localStartDate}</p>
            <p className="font-medium">Finished:</p>
            <p>{localReadDate}</p>
          </div>
        )}
        
        {status === 'read' && (
          <div className="mt-2">
            <Rating
              name={`rating-${id}`}
              value={editedBook.rating || 0}
              precision={0.5}
              size="medium"
              onChange={(_, newValue) => {
                setEditedBook({ ...editedBook, rating: newValue || 0 });
                updateBook(id, { ...editedBook, rating: newValue || 0 });
              }}
            />
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-3 mt-3">
          {status === 'read' && (
            <button
              className="text-teal-800 text-xs font-medium hover:bg-pink-50 px-2 py-1 rounded transition-colors flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setShowDateModal(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Reading Dates
            </button>
          )}
          
          {status === 'read' ? (
            <button
              className="text-gray-600 text-xs font-medium border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Want to Read
            </button>
          ) : (
            <button
              className="text-teal-800 text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark as Read
            </button>
          )}
        </div>
      </div>
      <button
        aria-label="delete"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
      >
        <DeleteIcon fontSize="small" />
      </button>
        </li>
      );
    }
    
    // List view - Horizontal layout with more details
    if (viewMode === 'list') {
      return (
        <li 
          className="relative flex items-center border-l-4 border-teal-600 p-3 rounded-lg bg-white shadow-sm w-full cursor-pointer transition-all duration-300 hover:shadow-md hover:border-l-8"
          onClick={handleViewDetails}
        >
          {cover && (
            <div className="flex-shrink-0 w-16 h-20 mr-4 overflow-hidden rounded">
              <img 
                src={cover} 
                alt={`Cover of ${title}`} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 flex flex-col gap-1 text-left min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800 truncate">{title}</h3>
              <div className="ml-2 flex-shrink-0">
                <Rating
                  name={`rating-${id}`}
                  value={editedBook.rating || 0}
                  precision={0.5}
                  size="small"
                  onChange={(_, newValue) => {
                    // Solo actualizar el rating localmente
                    setEditedBook({ ...editedBook, rating: newValue || 0 });
                    // Solo enviar el rating al backend, no todo el objeto libro
                    updateBook(id, { rating: newValue || 0 });
                  }}
                  readOnly={false}
                />
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 font-medium">
              <span className="truncate">{author}</span>
              {year && <span className="ml-1">({year})</span>}
              {genre && <span className="ml-2 text-xs text-teal-800 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100 font-medium">{genre}</span>}
            </div>
            
            <div className="flex items-center mt-1 gap-2">
              {status === 'read' && (
                <button
                  className="text-teal-800 text-xs font-medium hover:bg-pink-50 px-2 py-0.5 rounded transition-colors flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDateModal(true);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Edit Reading Dates
                </button>
              )}
              
              {status === 'read' ? (
                <button
                  className="text-gray-600 text-xs font-medium border border-gray-200 px-2 py-0.5 rounded-full transition-colors flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Want to Read
                </button>
              ) : (
                <button
                  className="text-teal-800 text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full transition-colors flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Read
                </button>
              )}
            </div>
          </div>
          
          <button
            className="ml-2 p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <DeleteIcon fontSize="small" />
          </button>
        </li>
      );
    }
    
    // Compact view - Minimal horizontal layout
    if (viewMode === 'compact') {
      return (
        <li 
          className="relative flex items-center py-2 px-3 w-full cursor-pointer transition-all duration-200 hover:bg-gray-50"
          onClick={handleViewDetails}
        >
          <div className="flex-1 flex items-center min-w-0">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-800 truncate">{title}</h3>
              <p className="text-sm text-gray-600 truncate">{author}</p>
            </div>
            
            <div className="flex items-center gap-3 ml-4">
              {genre && <span className="text-xs text-teal-800 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100 font-medium whitespace-nowrap">{genre}</span>}
              
              <Rating
                name={`rating-${id}`}
                value={editedBook.rating || 0}
                precision={0.5}
                size="small"
                onChange={(_, newValue) => {
                  setEditedBook({ ...editedBook, rating: newValue || 0 });
                  updateBook(id, { ...editedBook, rating: newValue || 0 });
                }}
                readOnly={false}
              />
              
              {status === 'read' ? (
                <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full whitespace-nowrap">Read</span>
              ) : (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">Want to Read</span>
              )}
            </div>
          </div>
          
          <button
            className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <DeleteIcon fontSize="small" />
          </button>
        </li>
      );
    }
  };

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
