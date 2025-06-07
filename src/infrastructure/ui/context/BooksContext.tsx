import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Book, BookDTO } from '../../../domain/entities/Book';
import { BookRepositoryImpl } from '../../repositories/BookRepositoryImpl';
import { AuthContext } from './AuthContext';

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
  addBook: async () => {},
  updateBook: async () => undefined,
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
          setError(`This book is already in your LEÍDO library"${existingBook.title}".`);
          throw new Error(`Libro duplicado: ${existingBook.title}`);
        }
      }
      
      // Obtener el ID de usuario desde localStorage si no está disponible en el contexto
      let userId = user?.id;
      
      // Si el ID de usuario no está disponible en el contexto, intentar obtenerlo de diferentes fuentes
      if (!userId) {
        console.log('Intentando obtener userId desde diferentes fuentes');
        
        // 1. Intentar obtener desde localStorage['user']
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
        
        // 2. Si aún no tenemos userId, intentar decodificar el token JWT
        if (!userId) {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              // Decodificar el token JWT (parte de en medio, codificada en base64)
              const payload = token.split('.')[1];
              if (payload) {
                const decodedPayload = JSON.parse(atob(payload));
                console.log('Token JWT decodificado:', decodedPayload);
                userId = decodedPayload.id; // El backend pone el ID de usuario en el campo 'id' del token
                console.log('ID de usuario obtenido del token JWT:', userId);
              }
            } catch (error) {
              console.error('Error al decodificar el token JWT:', error);
            }
          } else {
            console.log('No se encontró token en localStorage');
          }
        }
        
        // 3. Intentar obtener el email como último recurso
        if (!userId) {
          // Como último recurso, usar el email como identificador (no es lo ideal pero puede funcionar temporalmente)
          if (user?.email) {
            userId = user.email;
            console.log('Usando email como identificador temporal:', userId);
          } else if (savedUserString) {
            try {
              const savedUser = JSON.parse(savedUserString);
              if (savedUser.email) {
                userId = savedUser.email;
                console.log('Usando email de localStorage como identificador temporal:', userId);
              }
            } catch {}
          }
        }
      }
      
      // Si seguimos sin tener ID de usuario, no podemos continuar
      if (!userId) {
        const error = new Error('No se pudo obtener el ID de usuario');
        console.error(error);
        setError(error.message);
        return;
      }
      
      // Si no existe, añadir el libro
      const addedBook = await bookRepository.addBook({ ...newBook, userId });
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
      const updatedData = await bookRepository.updateBook(id, updatedBook);
      
      // Actualizar la lista de libros, reemplazando el libro con el ID original
      // con el libro actualizado que puede tener un nuevo ID
      setBooks((prevBooks) => {
        // Primero eliminamos el libro con el ID original
        const filteredBooks = prevBooks.filter((book) => book.id !== id);
        // Luego añadimos el libro actualizado (que puede tener un nuevo ID)
        return [...filteredBooks, updatedData];
      });
      
      // Devolver el libro actualizado para que los componentes puedan acceder al nuevo ID
      return updatedData;
    } catch (error: any) {
      console.error('Error updating book:', error);
      setError(error.message);
      throw error; // Re-lanzar el error para que los componentes puedan manejarlo
    }
  };

  // Delete a book
  const deleteBookHandler = async (id: string) => {
    if (!user || !token) return;
    
    try {
      await bookRepository.deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
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
