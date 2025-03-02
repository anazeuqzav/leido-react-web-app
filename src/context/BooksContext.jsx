// Importaciones
import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext"; // Contexto de Autenticación para identificar al usuario
import { getBooks, addBook, updateBook, deleteBook } from "../api/api"; // Funciones de la api para hacer CRUD

// Se crea un contexto global que se utiliza para compartir el estado de los libros en toda la aplicación.
export const BooksContext = createContext();

// Proveedor del contexto que envuelve a los componentes que necesiten acceder a los libros  
export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]); // Guarda los libros
  const [error, setError] = useState(null); // Estado para manejar errores
  const { user, token } = useContext(AuthContext); // Obtiene el token y el usuario para identificar al usuario

  // Carga los libros desde la API
  useEffect(() => {
    if (user && token) {
      getBooks(user.id)
      .then(setBooks)
      .catch((error) => {
        console.error("Error cargando libros:", error);
        setError(error.message); // Guarda el mensaje de error
      });
    }
  }, [user, token]);

  // Maneja la función de añadir libro a la API
  const addBookHandler = async (newBook) => {
    if (!user || !token) return;
    try {
      const addedBook = await addBook({ ...newBook, userId: user.id });
      if (addedBook) setBooks([...books, addedBook]);
    } catch (error) {
      console.error("Error al añadir libro:", error);
      setError(error.message);
    }
    
  };
  
  // Maneja la función de actualizar un libro en la API
  const updateBookHandler = async (id, updatedBook) => {
    if (!user || !token) return;
    try {
       const updatedData = await updateBook(id, updatedBook);
        if (updatedData) {
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === id ? updatedData : book))
          );
       }
    } catch (error) {
      console.error("Error al actualizar libro:", error);
      setError(error.message);
    }
   
  };

  // Maneja la función de eliminar un libro en la API
  const deleteBookHandler = async (id) => {
    if (!user || !token) return;
    try {
        if (await deleteBook(id)) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      setError(error.message);
    }
    
  };

  // Filtra los libros para organizarlos por listas
  const readBooks = books.filter((book) => book.leido === true);
  const unreadBooks = books.filter((book) => book.leido === false);
  const favoriteBooks = books.filter((book) => book.puntuacion === 5);

  // Borra el error cuando pasan 5 segundos 
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

 /**
  * Envuelve a los componentes hijos dandoles acceso a los libros, las funciones para interactuar con la API 
  y las listas filtradas
  */
  return (
    <BooksContext.Provider
      value={{
        books,
        addBook: addBookHandler,
        updateBook: updateBookHandler,
        deleteBook: deleteBookHandler,
        readBooks,
        unreadBooks,
        favoriteBooks,
        error,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

// Validación de PropTypes
BooksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
