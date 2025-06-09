import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Book, BookDTO } from '../../../domain/entities/Book';
import { BookRepositoryImpl } from '../../repositories/BookRepositoryImpl';
import { AuthContext } from './AuthContext';
import { publish } from '../../utils/eventBus';

// Create the repository, use cases, and service
const bookRepository = new BookRepositoryImpl();

// Define the context type
interface BooksContextType {
  books: Book[];
  readBooks: Book[];
  unreadBooks: Book[];
  favoriteBooks: Book[];
  addBook: (book: BookDTO) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<Book | undefined>;
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
  addBook: async () => { },
  updateBook: async () => undefined,
  deleteBook: async () => { },
  getBookById: () => undefined,
  fetchBooks: async () => { },
  error: null,
});

interface BooksProviderProps {
  children: ReactNode;
}

export const BooksProvider: React.FC<BooksProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useContext(AuthContext);

  // Function to load books from the API
  const fetchBooksHandler = async (): Promise<void> => {
    if (user && token) {
      try {
        const fetchedBooks = await bookRepository.getBooks(user.id);
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

  // Verify if a book already exists by its externalId
  const bookExistsByExternalId = (externalId: string | undefined): Book | undefined => {
    if (!externalId) return undefined;
    return books.find(book => book.externalId === externalId);
  };

  // Add a new book
  const addBookHandler = async (newBook: BookDTO) => {
    if (!user || !token) return;

    try {
      // Verify if the book already exists by its externalId
      if (newBook.externalId) {
        const existingBook = bookExistsByExternalId(newBook.externalId);

        if (existingBook) {
          // The book already exists, show an error
          setError(`This book is already in your LEÍDO library"${existingBook.title}".`);
          throw new Error(`Libro duplicado: ${existingBook.title}`);
        }
      }

      // Get the user ID from localStorage if not available in the context
      let userId = user?.id;

      // If the user ID is not available in the context, try to obtain it from different sources
      if (!userId) {
        console.log('Intentando obtener userId desde diferentes fuentes');

        // 1. Try to obtain from localStorage['user']
        const savedUserString = localStorage.getItem('user');
        console.log('Valor de localStorage["user"]:', savedUserString);

        if (savedUserString) {
          try {
            const savedUser = JSON.parse(savedUserString);
            console.log('Usuario parseado de localStorage:', savedUser);
            userId = savedUser.id;  // Obtener de user.id
            console.log('ID de usuario obtenido de localStorage["user"].id:', userId);
          } catch (error) {
            console.error('Error al parsear el usuario de localStorage:', error);
          }
        }
      }

      // If we don't have a user ID, we can't continue
      if (!userId) {
        const error = new Error('No se pudo obtener el ID de usuario');
        console.error(error);
        setError(error.message);
        return;
      }

      // If the book doesn't exist, add it
      const addedBook = await bookRepository.addBook({ ...newBook, userId });
      setBooks([...books, addedBook]);
      
      // Publish event to notify that books have been updated
      publish('BOOKS_UPDATED');
    } catch (error: any) {
      console.error('Error adding book:', error);
      setError(error.message);
    }
  };

  // Update a book
  const updateBookHandler = async (id: string, updatedBook: Partial<Book>) => {
    if (!user || !token) return;

    try {
      const updatedData = await bookRepository.updateBook(id, updatedBook);
      setBooks((prevBooks) => {
        // First remove the book with the original ID
        const filteredBooks = prevBooks.filter((book) => book.id !== id);
        // Then add the updated book (which may have a new ID)
        return [...filteredBooks, updatedData];
      });

      // Publish event to notify that books have been updated
      publish('BOOKS_UPDATED');
      
      // Return the updated book so components can access the new ID
      return updatedData;
    } catch (error: any) {
      console.error('Error updating book:', error);
      setError(error.message);
      throw error; // Re-throw the error so components can handle it
    }
  };

  // Delete a book
  const deleteBookHandler = async (id: string) => {
    if (!user || !token) return;

    try {
      await bookRepository.deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      
      // Publish event to notify that books have been updated
      publish('BOOKS_UPDATED');
    } catch (error: any) {
      console.error('Error deleting book:', error);
      setError(error.message);
    }
  };

  // Filter books by status
  const readBooks = Array.isArray(books) ? books.filter(book => book.status === 'read') : [];
  const unreadBooks = Array.isArray(books) ? books.filter(book => book.status === 'to-read') : [];
  const favoriteBooks = Array.isArray(books) ? books.filter(book => book.rating === 5) : [];

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
