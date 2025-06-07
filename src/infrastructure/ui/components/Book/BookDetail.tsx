import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';
import { BooksContext } from '../../context/BooksContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BookDetails } from '../../../../domain/entities/SearchBook';
import { Book } from '../../../../domain/entities/Book';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkAsReadBtn from '../buttons/MarkAsReadBtn';

/**
 * Component that displays detailed information about a book
 * Can display details for both search results and library books
 */
const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getBookDetails } = useContext(SearchContext);
  const { addBook, getBookById, updateBook, books } = useContext(BooksContext);
  const { user } = useContext(AuthContext);
  
  const [book, setBook] = useState<BookDetails | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [authorNames, setAuthorNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [libraryBook, setLibraryBook] = useState<Book | null>(null);
  const [showMarkAsRead, setShowMarkAsRead] = useState<boolean>(false);
  
  // Determinar si estamos viendo un libro de la biblioteca o un libro de búsqueda
  const isLibraryBook = location.pathname.includes('/library-book/');

  // Función para verificar si un libro ya existe por su externalId
  const checkIfBookExists = (externalId: string): Book | undefined => {
    if (!externalId) return undefined;
    return books.find(book => book.externalId === externalId);
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return;
      
      setLoading(true);
      try {
        if (isLibraryBook) {
          // Si es un libro de la biblioteca, obtener los detalles del libro de la biblioteca
          const userBook = getBookById(bookId);
          if (userBook) {
            setLibraryBook(userBook);
            
            // Buscar el libro en Open Library por título y autor (solo en inglés)
            const query = `${userBook.title} ${userBook.author}`;
            const searchResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query + " language:eng")}`);
            const searchData = await searchResponse.json();
            
            if (searchData.docs && searchData.docs.length > 0) {
              // Usar el primer resultado que coincida mejor
              const olid = searchData.docs[0].key.split('/').pop();
              if (olid) {
                // Obtener los detalles completos del libro
                const bookDetails = await getBookDetails(olid);
                setBook(bookDetails);
                
                // Cover image
                if (userBook.cover) {
                  setCoverUrl(userBook.cover);
                } else if (bookDetails.covers && bookDetails.covers.length > 0) {
                  setCoverUrl(`https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg`);
                }
                
                // Autor
                setAuthorNames([userBook.author]);
              }
            } else {
              // Si no se encuentra en Open Library, usar los datos de la biblioteca
              setCoverUrl(userBook.cover || '');
              setAuthorNames([userBook.author]);
              
              // Crear un objeto BookDetails con los datos disponibles
              setBook({
                key: userBook.id,
                title: userBook.title,
                first_publish_date: userBook.year ? userBook.year.toString() : undefined,
                subjects: userBook.genre ? [userBook.genre] : undefined
              });
            }
          } else {
            setError('Libro no encontrado en tu biblioteca');
          }
        } else {
          // Si es un libro de búsqueda, obtener los detalles normalmente
          const bookDetails = await getBookDetails(bookId);
          setBook(bookDetails);
          
          // Cover image
          if (bookDetails.covers && bookDetails.covers.length > 0) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg`);
          }
          
          // Verificar si el libro ya existe en la biblioteca por su externalId
          const olid = bookDetails.key.split('/').pop() || '';
          const existingBookInLibrary = checkIfBookExists(olid);
          
          if (existingBookInLibrary) {
            // En lugar de mostrar el panel amarillo, redirigir automáticamente
            // a la vista de detalle del libro en la biblioteca
            navigate(`/library-book/${existingBookInLibrary.id}`);
            return; // Detener la ejecución del resto del useEffect
          }
          
          // Fetch author names
          if (bookDetails.authors && bookDetails.authors.length > 0) {
            const fetchedNames = await Promise.all(
              bookDetails.authors.map(async (author) => {
                const response = await fetch(`https://openlibrary.org${author.author.key}.json`);
                const data = await response.json();
                return data.name;
              })
            );
            setAuthorNames(fetchedNames);
          }
        }
      } catch (err: any) {
        console.error('Error fetching book details:', err);
        setError(err.message || 'Error fetching book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, getBookDetails, isLibraryBook, getBookById]);

  const handleAddToLibrary = async (status: 'read' | 'to-read') => {
    if (!book || !user) return;
    
    try {
      const newBook: Omit<Book, 'id'> = {
        title: book.title,
        author: authorNames.join(', '),
        year: book.first_publish_date ? parseInt(book.first_publish_date.substring(0, 4)) : undefined,
        genre: book.subjects ? book.subjects[0] : undefined,
        status,
        rating: status === 'read' ? 0 : undefined,
        cover: coverUrl,
        userId: user.id,
        readDate: status === 'read' ? new Date() : undefined,
      };
      
      await addBook(newBook);
      
      // Show toast notification
      if (status === 'read') {
        toast.success(`"${book.title}" has been added to your read books!`);
      } else {
        toast.success(`"${book.title}" has been added to your want to read list!`);
      }
      
      navigate('/');
    } catch (err) {
      console.error('Error adding book to library:', err);
      toast.error('Failed to add book to your library. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Book not found'}</p>
        </div>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        className="mb-4 text-teal-700 hover:text-teal-800 hover:bg-teal-50"
        variant="text"
      >
        Go Back
      </Button>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-teal-100">
        <div className="flex flex-col md:flex-row">
          {/* Imagen del libro */}
          {coverUrl && (
            <div className="md:w-1/3 mb-6 md:mb-0 md:mr-8 flex justify-center items-start">
              <img 
                src={coverUrl} 
                alt={`Cover of ${book.title}`} 
                className="w-full max-w-[300px] h-auto max-h-[450px] rounded-lg shadow-lg border border-gray-200 object-cover"
              />
            </div>
          )}
          
          {/* Información del libro */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-teal-800 mb-3 leading-tight">{book.title}</h1>
            
            {authorNames.length > 0 && (
              <p className="text-xl text-gray-700 mb-4 font-medium">
                by {authorNames.join(', ')}
              </p>
            )}
            
            {book.first_publish_date && (
              <p className="text-gray-600 mb-3">
                <span className="font-medium">First published:</span> {book.first_publish_date}
              </p>
            )}
            
            {book.subjects && book.subjects.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-teal-800 mb-2">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 5).map((subject, index) => (
                    <span 
                      key={index} 
                      className="bg-teal-50 text-teal-700 text-sm px-3 py-1 rounded-full border border-teal-200 shadow-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {book.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-teal-800 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {typeof book.description === 'string' 
                    ? book.description 
                    : book.description.value || 'No description available'}
                </p>
              </div>
            )}
            
            {/* Sección de botones y acciones */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              {isLibraryBook && libraryBook && libraryBook.status === 'to-read' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 shadow-sm">
                    <p className="font-medium text-base">This book is in your "Want to Read" list</p>
                    <p className="text-sm mt-2">You can mark it as read when you finish it.</p>
                  </div>
                  
                  <button
                    className="text-teal-800 text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors flex items-center"
                    onClick={() => setShowMarkAsRead(!showMarkAsRead)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Read
                  </button>
                  
                  {showMarkAsRead && (
                    <div className="bg-white border border-teal-200 rounded-lg shadow-md p-4 mt-2 max-w-md">
                      <h3 className="font-medium text-teal-800 text-base mb-3">Add details for read book</h3>
                      <MarkAsReadBtn 
                        book={book}
                        authorNames={authorNames}
                        coverUrl={coverUrl}
                        onSuccess={() => {
                          setShowMarkAsRead(false);
                          navigate('/');
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : isLibraryBook && libraryBook && libraryBook.status === 'read' ? (
                <div className="space-y-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-teal-800 shadow-sm">
                    <p className="font-medium text-base">You have already read this book</p>
                    
                    {/* Fechas de lectura */}
                    <div className="mt-3 space-y-2">
                      {libraryBook.startDate && (
                        <p className="text-sm flex items-center">
                          <span className="font-medium min-w-[130px]">Fecha de inicio:</span> 
                          <span>{new Date(libraryBook.startDate).toLocaleDateString()}</span>
                        </p>
                      )}
                      {libraryBook.readDate && (
                        <p className="text-sm flex items-center">
                          <span className="font-medium min-w-[130px]">Fecha de finalización:</span> 
                          <span>{new Date(libraryBook.readDate).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                    
                    {/* Rating */}
                    {libraryBook.rating && libraryBook.rating > 0 && (
                      <div className="mt-3 flex items-center">
                        <span className="font-medium text-sm min-w-[130px]">Your rating:</span>
                        <Rating 
                          value={libraryBook.rating} 
                          readOnly 
                          precision={0.5} 
                          size="medium"
                        />
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      if (libraryBook && libraryBook.id) {
                        // Update the book status to 'to-read' and remove read date and rating
                        updateBook(libraryBook.id, {
                          status: 'to-read',
                          readDate: undefined,
                          rating: undefined
                        }).then(() => {
                          // Show toast notification
                          toast.success(`"${libraryBook.title}" has been moved to your want to read list!`);
                          // Redirigir a la página principal después de actualizar
                          navigate('/');
                        });
                      }
                    }}
                    className="text-gray-600 text-xs font-medium border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Want to Read
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="text-teal-800 text-xs font-medium border border-pink-200 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors flex items-center"
                      onClick={() => setShowMarkAsRead(!showMarkAsRead)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Read
                    </button>
                    <button
                      className="text-gray-600 text-xs font-medium border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors flex items-center"
                      onClick={() => handleAddToLibrary('to-read')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Want to Read
                    </button>
                  </div>
                  
                  {showMarkAsRead && (
                    <div className="bg-white border border-teal-200 rounded-lg shadow-md p-4 mt-2 max-w-md">
                      <h3 className="font-medium text-teal-800 text-base mb-3">Add details for read book</h3>
                      <MarkAsReadBtn 
                        book={book}
                        authorNames={authorNames}
                        coverUrl={coverUrl}
                        onSuccess={() => {
                          setShowMarkAsRead(false);
                          navigate('/');
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
