import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from '@mui/material/Button';

/* Styled Components */

// Contenedor del filtro
const FilterContainer = styled.div`
  margin-bottom: 15px;
  text-align: left;
  margin-left: 40px;
  margin-right: 50px;
`;


// Contenedor de checkboxes
const CheckboxContainer = styled.div`
  display: ${({ visible }) => (visible ? "flex" : "none")}; /* Muestra solo si está activo */
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  justify-content: space-around;
`;

// Estilos para cada checkbox
const Label = styled.label`
  display: block;
  margin: 5px 0;
  cursor: pointer;
`;

/**
 * Filtro con checkboxes que permite filtrar los libros por género
 * @param {Object, Function} param0 Recibe los libros filtrados y la función para filtrar
 * @returns Una lista de libros que incluyen los géneros seleccionados
 */
const Filter = ({ books, setFilteredBooks }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // Estado para mostrar/ocultar los filtros


  // Obtiene los géneros únicos de los libros
  const allGenres = [...new Set(books.map((book) => book.genero))];

  // Maneja la selección/deselección de géneros
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;

    setSelectedGenres((prevGenres) =>
      checked ? [...prevGenres, value] : prevGenres.filter((g) => g !== value)
    );
  };

  // Filtrar los libros cada vez que cambia la selección de géneros
  useEffect(() => {
    if (selectedGenres.length === 0) {
      setFilteredBooks(books); // Si no hay filtros, muestra todos los libros
    } else {
      const filtered = books.filter((book) => selectedGenres.includes(book.genero)); // selecciona los que incluyen el género
      setFilteredBooks(filtered);
    }
  }, [selectedGenres, books, setFilteredBooks]);

  return (
    <FilterContainer>
      <Button variant="contained" color="primary"onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Ocultar Filtros" : "Filtrar"}
      </Button>
      <CheckboxContainer visible={showFilters}>
        {allGenres.map((genre) => (
          <Label key={genre}>
            <input type="checkbox" value={genre} onChange={handleGenreChange} />
            {genre}
          </Label>
        ))}
      </CheckboxContainer>
    </FilterContainer>
  );
};

// Validación de PropType
Filter.propTypes = {
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

export default Filter;
