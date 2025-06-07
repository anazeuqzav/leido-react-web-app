import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../../../domain/entities/Book';
import { BooksContext } from '../../context/BooksContext';
import { toast } from 'react-toastify';
import { BookItemProps } from './types';
import BookDisplay from './BookDisplay';
import BookRating from './BookRating';
import BookActions from './BookActions';
import BookReadingDates from './BookReadingDates';
import UpdateReadDateModal from '../modals/UpdateReadDateModal';
import AddBookDetailsModal from '../modals/AddBookDetailsModal';

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
  const [showUpdateDateModal, setShowUpdateDateModal] = useState<boolean>(false);
  const [showAddDetailsModal, setShowAddDetailsModal] = useState<boolean>(false);
  
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
  
  // Handle book deletion, showing a confirmation window
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${currentBook.title}"?`)) {
      deleteBook(currentBook.id);
    }
  };

  // Function to mark a book as read or unread
  const handleToggleStatus = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Si el libro está en estado 'to-read' y se va a marcar como leído,
    // mostrar el modal para añadir fechas y puntuación
    if (currentBook.status === 'to-read') {
      setShowAddDetailsModal(true);
      return;
    }
    
    // Si el libro está en estado 'read' y se va a marcar como 'to-read'
    const newStatus = 'to-read';
    
    // Prepare update data based on the new status
    const updateData: Partial<Book> = {
      status: newStatus,
      readDate: undefined // Eliminar la fecha de lectura
    };
    
    console.log(`Changing book status from ${currentBook.status} to ${newStatus}`, updateData);
    
    updateBook(currentBook.id, updateData).then(() => {
      toast.success(`"${currentBook.title}" has been added to your want to read list!`);
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
    navigate(`/library-book/${currentBook.id}`);
  };

  // Manejar el cambio de calificación
  const handleRatingChange = (newValue: number | null) => {
    const updatedRating = newValue || 0;
    setEditedBook({ ...editedBook, rating: updatedRating });
    updateBook(currentBook.id, { rating: updatedRating });
  };

  // Manejar la edición de fechas
  const handleEditDates = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowUpdateDateModal(true);
  };

  // Función para manejar la confirmación del modal de detalles al añadir un libro como leído
  const handleAddDetailsConfirm = (startDate: Date | null, readDate: Date | null, rating: number | null) => {
    // Preparar los datos para actualizar el libro
    const updateData: Partial<Book> = {
      status: 'read',
      startDate: startDate || undefined,
      readDate: readDate || undefined,
      rating: rating || undefined
    };
    
    console.log(`Marcando libro como leído con detalles:`, updateData);
    
    updateBook(currentBook.id, updateData).then(() => {
      toast.success(`"${currentBook.title}" has been marked as read!`);
    }).catch(error => {
      console.error('Error updating book status:', error);
      toast.error('Failed to update book status. Please try again.');
    });
    
    setShowAddDetailsModal(false);
  };

  // Renderizar el componente según el modo de visualización
  const renderBookItem = () => {
    if (viewMode === 'grid') {
      return (
        <li className="relative mb-6">
          <div className="relative">
            {/* Botón de eliminar */}
            <div className="absolute top-2 right-2 z-10 pointer-events-auto">
              <button
                aria-label="delete"
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Contenido principal del libro */}
            <div 
              className="relative border-l-4 border-teal-600 p-4 rounded-lg bg-white shadow-md w-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] hover:border-l-8"
              onClick={handleViewDetails}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Imagen del libro */}
                {currentBook.cover && (
                  <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                    <img
                      src={currentBook.cover}
                      alt={`Cover of ${currentBook.title}`}
                      className="w-full sm:w-28 h-40 object-cover rounded-md shadow-sm"
                    />
                  </div>
                )}
                
                {/* Información del libro */}
                <div className="flex-1 flex flex-col text-left">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{currentBook.title}</h3>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{currentBook.author} {currentBook.year && `(${currentBook.year})`}</p>
                    {currentBook.genre && (
                      <span className="text-xs text-teal-800 bg-pink-50 inline-block mt-1 px-2 py-1 rounded-full border border-pink-100 font-medium">{currentBook.genre}</span>
                    )}
                    
                    {/* Fechas de lectura justo debajo del género */}
                    {currentBook.status === 'read' && (
                      <div className="mt-1">
                        <BookReadingDates book={currentBook} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sección inferior con rating y acciones */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="sm:ml-36">
                  {currentBook.status === 'read' && (
                    <div className="mb-2">
                      <BookRating 
                        id={currentBook.id} 
                        rating={editedBook.rating} 
                        onChange={handleRatingChange} 
                      />
                    </div>
                  )}
                  <div className="mt-2">
                    <BookActions 
                      book={currentBook} 
                      onToggleStatus={handleToggleStatus} 
                      onEditDates={handleEditDates}
                      onRatingChange={handleRatingChange}
                      viewMode={viewMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    }
    
    // List view
    if (viewMode === 'list') {
      return (
        <li className="relative mb-4">
          <div className="relative">
            {/* Contenido principal del libro */}
            <div 
              className="relative border-l-4 border-teal-600 p-4 rounded-lg bg-white shadow-sm w-full cursor-pointer transition-all duration-300 hover:shadow-md hover:border-l-8"
              onClick={handleViewDetails}
            >
              <div className="flex items-start">
                {/* Imagen del libro */}
                {currentBook.cover && (
                  <div className="flex-shrink-0 w-16 h-20 mr-5 overflow-hidden rounded">
                    <img 
                      src={currentBook.cover} 
                      alt={`Cover of ${currentBook.title}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Información del libro */}
                <div className="flex-1 flex flex-col text-left min-w-0">
                  <h3 className="text-base font-bold text-gray-800 mb-2">{currentBook.title}</h3>
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 font-medium">
                      <span>{currentBook.author}</span>
                      {currentBook.year && <span> ({currentBook.year})</span>}
                    </div>
                    {currentBook.genre && (
                      <span className="text-xs text-teal-800 bg-pink-50 inline-block mt-1 px-2 py-0.5 rounded-full border border-pink-100 font-medium">{currentBook.genre}</span>
                    )}
                  </div>
                  
                  {/* Rating en la parte derecha */}
                  <div className="absolute top-4 right-4 z-10 pointer-events-auto">
                    {currentBook.status === 'read' && (
                      <BookRating 
                        id={currentBook.id} 
                        rating={editedBook.rating} 
                        onChange={handleRatingChange}
                        size="small"
                      />
                    )}
                  </div>
                  
                  {/* Fechas de lectura y acciones */}
                  <div className="flex items-center mt-2 gap-2">
                    {currentBook.status === 'read' && (
                      <div className="mr-4">
                        <BookReadingDates book={currentBook} />
                      </div>
                    )}
                    <BookActions 
                      book={currentBook} 
                      onToggleStatus={handleToggleStatus} 
                      onEditDates={handleEditDates}
                      onRatingChange={handleRatingChange}
                      viewMode={viewMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    }
    
    // Compact view
    return (
      <li className="relative mb-2">
        <div className="relative">
          {/* Contenido principal del libro */}
          <div 
            className="relative flex items-center py-3 px-4 w-full cursor-pointer transition-all duration-200 hover:bg-gray-50"
            onClick={handleViewDetails}
          >
            <div className="flex items-start w-full">
              {/* Información del libro */}
              <div className="flex-1 mr-4">
                <h3 className="text-base font-medium text-gray-800 mb-1">{currentBook.title}</h3>
                <div>
                  <p className="text-sm text-gray-600">{currentBook.author} {currentBook.year && `(${currentBook.year})`}</p>
                  {currentBook.genre && (
                    <span className="text-xs text-teal-800 bg-pink-50 inline-block mt-1 px-2 py-0.5 rounded-full border border-pink-100 font-medium">{currentBook.genre}</span>
                  )}
                </div>
                
                {/* Fechas de lectura (solo para libros leídos) */}
                {currentBook.status === 'read' && (
                  <div className="mt-1">
                    <BookReadingDates book={currentBook} />
                  </div>
                )}
              </div>
              
              {/* Rating y acciones a la derecha */}
              <div className="flex items-center gap-3 pointer-events-auto">
                {currentBook.status === 'read' && (
                  <BookRating 
                    id={currentBook.id} 
                    rating={editedBook.rating} 
                    onChange={handleRatingChange}
                    size="small"
                  />
                )}
                <BookActions 
                  book={currentBook} 
                  onToggleStatus={handleToggleStatus} 
                  onEditDates={handleEditDates}
                  onRatingChange={handleRatingChange}
                  viewMode={viewMode}
                />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      {showUpdateDateModal && (
        <UpdateReadDateModal
          book={currentBook}
          onClose={() => setShowUpdateDateModal(false)}
          onBookUpdated={(updatedBookId) => {
            // Actualizar el ID del libro si ha cambiado después de la actualización
            if (updatedBookId && updatedBookId !== currentBookId) {
              console.log(`Actualizando ID del libro después de editar fechas: ${currentBookId} -> ${updatedBookId}`);
              setCurrentBookId(updatedBookId);
            }
          }}
        />
      )}
      
      {showAddDetailsModal && (
        <AddBookDetailsModal
          isOpen={showAddDetailsModal}
          onClose={() => setShowAddDetailsModal(false)}
          onConfirm={handleAddDetailsConfirm}
          initialStartDate={currentBook.startDate ? new Date(currentBook.startDate) : new Date()}
          initialReadDate={currentBook.readDate ? new Date(currentBook.readDate) : new Date()}
          initialRating={currentBook.rating || 0}
        />
      )}
      
      {renderBookItem()}
    </>  
  );
};

export default BookItem;
