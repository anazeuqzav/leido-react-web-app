import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext"; // Asegúrate de tener un contexto de autenticación

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/libros?userId=${user.id}`) // Filtra por usuario
        .then((response) => response.json())
        .then((data) => setBooks(data))
        .catch((error) => console.error("Error cargando libros:", error));
    }
  }, [user]);

  const addBook = async (newBook) => {
    if (!user) return;

    const bookWithUser = { ...newBook, userId: user.id };

    try {
      const response = await fetch("http://localhost:5000/libros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookWithUser),
      });

      if (!response.ok) {
        throw new Error("Error al añadir el libro");
      }

      const addedBook = await response.json();
      setBooks([...books, addedBook]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBook = async (id, updatedBook) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/libros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el libro");
      }

      const updatedData = await response.json();
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? updatedData : book))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (id) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/libros/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el libro");
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const librosLeidos = books.filter((book) => book.leido === true);
  const librosPorLeer = books.filter((book) => book.leido === false);
  const librosFavoritos = books.filter((book) => book.puntuacion === 5);

  return (
    <BooksContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        librosLeidos,
        librosPorLeer,
        librosFavoritos,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

BooksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
