import { useState, useEffect } from "react";
import PropTypes from "prop-types";


const FiltroGenero = ({ books, setFilteredBooks }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Obtener géneros únicos de los libros
  const allGenres = [...new Set(books.map((book) => book.genero))];

  // Manejar selección/deselección de géneros
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;

    setSelectedGenres((prevGenres) =>
      checked ? [...prevGenres, value] : prevGenres.filter((g) => g !== value)
    );
  };

  // Filtrar libros cada vez que cambia la selección de géneros
  useEffect(() => {
    if (selectedGenres.length === 0) {
      setFilteredBooks(books); // Si no hay filtros, mostrar todos los libros
    } else {
      const filtered = books.filter((book) => selectedGenres.includes(book.genero));
      setFilteredBooks(filtered);
    }
  }, [selectedGenres, books, setFilteredBooks]);

  return (
    <div>
      <h4>Filtrar por Género</h4>
      {allGenres.map((genre) => (
        <label key={genre} style={{ display: "block" }}>
          <input
            type="checkbox"
            value={genre}
            onChange={handleGenreChange}
          />
          {genre}
        </label>
      ))}
    </div>
  );
};

FiltroGenero.propTypes = {
    books: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        titulo: PropTypes.string.isRequired,
        autor: PropTypes.string.isRequired,
        genero: PropTypes.string.isRequired,
        año: PropTypes.number.isRequired,
        puntuacion: PropTypes.number,
      })
    ).isRequired,
    setFilteredBooks: PropTypes.func.isRequired,
  };

export default FiltroGenero;
