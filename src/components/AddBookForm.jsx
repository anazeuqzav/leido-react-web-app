import { useState, useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import PropTypes from "prop-types";



const AddBookForm = ({defaultLeido}) => {
  const { addBook } = useContext(BooksContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newBook, setNewBook] = useState({
    titulo: "",
    autor: "",
    anio: "",
    genero: "",
    leido: defaultLeido,
    puntuacion: defaultLeido ? 1 : undefined,
  });

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook(newBook);
    setNewBook({ titulo: "", autor: "", anio: "", genero: "", leido: defaultLeido, puntuacion: 1 });
    setIsFormVisible(false); // Oculta el formulario después de añadir
  };

  return (
    <div>
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? "Cancelar" : "Añadir Libro"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
          <input type="text" name="titulo" placeholder="Título" value={newBook.titulo} onChange={handleChange} required />
          <input type="text" name="autor" placeholder="Autor" value={newBook.autor} onChange={handleChange} required />
          <input type="number" name="anio" placeholder="Año" value={newBook.anio} onChange={handleChange} required />
          <input type="text" name="genero" placeholder="Género" value={newBook.genero} onChange={handleChange} required />
          {defaultLeido && (
            <input type="number" name="puntuacion" min="1" max="5" placeholder="Puntuación" value={newBook.puntuacion} onChange={handleChange} required />
          )}          
          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  );
};

AddBookForm.propTypes = {
    defaultLeido: PropTypes.bool.isRequired,
}

export default AddBookForm;
