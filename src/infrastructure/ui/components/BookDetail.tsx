import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import { BooksContext } from '../context/BooksContext';
import { AuthContext } from '../context/AuthContext';
import { BookDetails } from '../../../domain/entities/SearchBook';
import { Book } from '../../../domain/entities/Book';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkAsReadBtn from './MarkAsReadBtn';

/**
 * Component that displays detailed information about a book
 */
const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { getBookDetails } = useContext(SearchContext);
  const { addBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);
  
  const [book, setBook] = useState<BookDetails | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [authorNames, setAuthorNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return;
      
      setLoading(true);
      try {
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
      } catch (err: any) {
        console.error('Error fetching book details:', err);
        setError(err.message || 'Error fetching book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, getBookDetails]);

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
