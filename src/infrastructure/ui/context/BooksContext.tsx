import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Book, BookDTO } from '../../../domain/entities/Book';
import { BookService } from '../../../application/services/BookService';
import { BookUseCases } from '../../../domain/useCases/BookUseCases';
import { BookRepositoryImpl } from '../../adapters/BookRepositoryImpl';
import { AuthContext } from './AuthContext';

// Create the repository, use cases, and service
const bookRepository = new BookRepositoryImpl();
const bookUseCases = new BookUseCases(bookRepository);
const bookService = new BookService(bookUseCases);

// Define the context type
interface BooksContextType {
  books: Book[];
  readBooks: Book[];
  unreadBooks: Book[];
  favoriteBooks: Book[];
  addBook: (book: BookDTO) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  fetchBooks: () => Promise<void>;
  error: string | null;
}

// Create the context with a default value
export const BooksContext = createContext<BooksContextType>({
  books: [],
  readBooks: [],
  unreadBooks: [],
  favoriteBooks: [],
  addBook: async () => {},
  updateBook: async () => {},
  deleteBook: async () => {},
  getBookById: () => undefined,
  fetchBooks: async () => {},
  error: null,
});

interface BooksProviderProps {
  children: ReactNode;
}

export const BooksProvider: React.FC<BooksProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useContext(AuthContext);

  // Función para cargar libros desde la API
  const fetchBooksHandler = async (): Promise<void> => {
    if (user && token) {
      try {
        const fetchedBooks = await bookService.getBooks(user.id);
        setBooks(fetchedBooks);
      } catch (error: any) {
        console.error('Error loading books:', error);
        setError(error.message);
      }
    }
  };

  // Load books from API when user or token changes
  useEffect(() => {
    fetchBooksHandler();
  }, [user, token]);

  // Verificar si un libro ya existe por su externalId
  const bookExistsByExternalId = (externalId: string | undefined): Book | undefined => {
    if (!externalId) return undefined;
    return books.find(book => book.externalId === externalId);
  };

  // Add a new book
  const addBookHandler = async (newBook: BookDTO) => {
    if (!user || !token) return;
    
    try {
      // Verificar si el libro ya existe por su externalId
      if (newBook.externalId) {
        const existingBook = bookExistsByExternalId(newBook.externalId);
        
        if (existingBook) {
          // El libro ya existe, mostrar un error
          setError(`Este libro ya está en tu biblioteca como "${existingBook.title}". No se puede añadir de nuevo.`);
          throw new Error(`Libro duplicado: ${existingBook.title}`);
        }
      }
      
      // Si no existe, añadir el libro
      const addedBook = await bookService.addBook({ ...newBook, userId: user.id });
      setBooks([...books, addedBook]);
    } catch (error: any) {
      console.error('Error adding book:', error);
      setError(error.message);
    }
  };

  // Update a book
  const updateBookHandler = async (id: string, updatedBook: Partial<Book>) => {
    if (!user || !token) return;
    
    try {
      const updatedData = await bookService.updateBook(id, updatedBook);
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? updatedData : book))
      );
    } catch (error: any) {
      console.error('Error updating book:', error);
      setError(error.message);
    }
  };

  // Delete a book
  const deleteBookHandler = async (id: string) => {
    if (!user || !token) return;
    
    try {
      await bookService.deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error: any) {
      console.error('Error deleting book:', error);
      setError(error.message);
    }
  };

  // Filter books by status
  const readBooks = bookService.getReadBooks(books);
  const unreadBooks = bookService.getUnreadBooks(books);
  const favoriteBooks = bookService.getFavoriteBooks(books);
  
  // Get a book by its ID
  const getBookByIdHandler = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <BooksContext.Provider
      value={{
        books,
        readBooks,
        unreadBooks,
        favoriteBooks,
        addBook: addBookHandler,
        updateBook: updateBookHandler,
        deleteBook: deleteBookHandler,
        getBookById: getBookByIdHandler,
        fetchBooks: fetchBooksHandler,
        error,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};
