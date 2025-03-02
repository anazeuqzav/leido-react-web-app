import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";


// Estilos para el contenedor del buscador
const SearchContainer = styled.div`
  width: 94%;
  margin-bottom: 15px;
  margin-left: 40px;
  display: flex;
`;

// Estilos para el input de búsqueda
const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
`;

/**
 * Buscador en tiempo real de libros por titulo y autor
 * @param {Function} param onSearch: función para buscar por el término de busqueda
 * @returns una lista de libros que incluyen el término de busqueda en autor o título
 */
const Searcher = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Buscar por título o autor..."
        value={searchTerm}
        onChange={handleChange}
      />
    </SearchContainer>
  );
};

// Validación de PropTypes
Searcher.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Searcher;