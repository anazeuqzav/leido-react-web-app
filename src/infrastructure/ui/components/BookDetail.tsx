import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import { BooksContext } from '../context/BooksContext';
import { AuthContext } from '../context/AuthContext';
import { BookDetails } from '../../../domain/entities/SearchBook';
import { Book } from '../../../domain/entities/Book';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkAsReadBtn from './MarkAsReadBtn';

/**
 * Component that displays detailed information about a book
 * Can display details for both search results and library books
 */
const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getBookDetails } = useContext(SearchContext);
  const { addBook, getBookById, updateBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);
  
  const [book, setBook] = useState<BookDetails | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [authorNames, setAuthorNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [libraryBook, setLibraryBook] = useState<Book | null>(null);
  
  // Determinar si estamos viendo un libro de la biblioteca o un libro de búsqueda
  const isLibraryBook = location.pathname.includes('/library-book/');

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
            
            // Buscar el libro en Open Library por título y autor
            const query = `${userBook.title} ${userBook.author}`;
            const searchResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
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
      navigate('/');
    } catch (err) {
      console.error('Error adding book to library:', err);
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
    <div className="container mx-auto p-4">
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Go Back
      </Button>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row">
          {coverUrl && (
            <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
              <img 
                src={coverUrl} 
                alt={`Cover of ${book.title}`} 
                className="w-full max-w-xs rounded shadow-md"
              />
            </div>
          )}
          
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-teal-800 mb-2">{book.title}</h1>
            
            {authorNames.length > 0 && (
              <p className="text-xl text-gray-700 mb-4">
                by {authorNames.join(', ')}
              </p>
            )}
            
            {book.first_publish_date && (
              <p className="text-gray-600 mb-2">
                First published: {book.first_publish_date}
              </p>
            )}
            
            {book.subjects && book.subjects.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 5).map((subject, index) => (
                    <span 
                      key={index} 
                      className="bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {book.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Description</h2>
                <p className="text-gray-700">
                  {typeof book.description === 'string' 
                    ? book.description 
                    : book.description.value || 'No description available'}
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mt-6">
              {isLibraryBook && libraryBook && libraryBook.status === 'read' ? (
                <div className="flex flex-col gap-3">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-teal-800">
                    <p className="font-medium">You have already read this book</p>
                    
                    {/* Fechas de lectura */}
                    <div className="mt-2 space-y-1">
                      {libraryBook.startDate && (
                        <p className="text-sm">
                          <span className="font-medium">Fecha de inicio:</span> {new Date(libraryBook.startDate).toLocaleDateString()}
                        </p>
                      )}
                      {libraryBook.readDate && (
                        <p className="text-sm">
                          <span className="font-medium">Fecha de finalización:</span> {new Date(libraryBook.readDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    {/* Rating */}
                    {libraryBook.rating && libraryBook.rating > 0 && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm mr-2">Your rating:</span>
                        <Rating 
                          value={libraryBook.rating} 
                          readOnly 
                          precision={0.5} 
                          size="small"
                        />
                      </div>
                    )}
                    
                    {/* Botón para editar fechas */}
                    <button 
                      onClick={() => {
                        // Aquí puedes abrir un modal o navegar a una página de edición
                        navigate(`/edit-book/${libraryBook.id}`);
                      }}
                      className="mt-3 text-xs text-teal-700 underline hover:text-teal-800"
                    >
                      Editar fechas de lectura
                    </button>
                  </div>
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => {
                      if (libraryBook && libraryBook.id) {
                        // Update the book status to 'to-read' and remove read date and rating
                        updateBook(libraryBook.id, {
                          status: 'to-read',
                          readDate: undefined,
                          rating: undefined
                        }).then(() => {
                          // Redirigir a la página principal después de actualizar
                          navigate('/');
                        });
                      }
                    }}
                    className="border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    Mark as "Want to Read"
                  </Button>
                </div>
              ) : (
                <>
                  <MarkAsReadBtn 
                    book={book}
                    authorNames={authorNames}
                    coverUrl={coverUrl}
                    onSuccess={() => navigate('/')}
                  />
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => handleAddToLibrary('to-read')}
                    className="border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    Add to Want to Read
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
