import { useState, useContext } from "react";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import { BooksContext } from "../context/BooksContext";

const BookItem = ({ id, titulo, autor, anio, genero, leido, puntuacion }) => {
  const { updateBook, deleteBook } = useContext(BooksContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState({ titulo, autor, anio, genero, puntuacion, leido });

  const handleChange = (e) => {
    setEditedBook({
      ...editedBook,
      [e.target.name]: e.target.name === "puntuacion" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSave = () => {
    updateBook(id, editedBook);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Seguro que quieres eliminar "${titulo}"?`)) {
      deleteBook(id);
    }
  };

  const handleToggleLeido = () => {
    const nuevoEstadoLeido = !editedBook.leido;
  
    updateBook(id, {
      ...editedBook,
      leido: nuevoEstadoLeido,
      puntuacion: nuevoEstadoLeido ? editedBook.puntuacion : undefined, // Si no está leído, borra la puntuación
    });
  };

  return (
    <li style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
      {isEditing ? (
        <div>
          <input type="text" name="titulo" value={editedBook.titulo} onChange={handleChange} />
          <input type="text" name="autor" value={editedBook.autor} onChange={handleChange} />
          <input type="number" name="anio" value={editedBook.anio} onChange={handleChange} />
          <input type="text" name="genero" value={editedBook.genero} onChange={handleChange} />
          <input type="text" name="puntuacion" value={editedBook.puntuacion} onChange={handleChange} />
          <button onClick={handleSave}>Guardar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      ) : (
        <div>
          {titulo} - {autor} ({anio}) {genero} {leido && <StarRating rating={puntuacion} />}
          <button onClick={() => setIsEditing(true)} style={{ marginLeft: "10px" }}>Editar</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>X</button>
          <button onClick={handleToggleLeido}>
            {leido ? "Marcar como No leído" : "Marcar como Leído"}
            </button>
        </div>
      )}
    </li>
  );
};

BookItem.propTypes = {
  id: PropTypes.number.isRequired,
  titulo: PropTypes.string.isRequired,
  autor: PropTypes.string.isRequired,
  anio: PropTypes.number.isRequired,
  genero: PropTypes.string.isRequired,
  leido: PropTypes.bool.isRequired,
  puntuacion: PropTypes.number,
};

export default BookItem;
