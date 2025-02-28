import { useState } from "react";
import PropTypes from "prop-types";

const Buscador = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Llama a la función que recibe como prop
  };

  return (
    <input
      type="text"
      placeholder="Buscar por título o autor..."
      value={searchTerm}
      onChange={handleChange}
      style={{ padding: "5px", marginBottom: "10px", width: "100%" }}
    />
  );
};

Buscador.propTypes = {
  onSearch: PropTypes.func.isRequired, // Aseguramos que reciba una función como prop
};

export default Buscador;
