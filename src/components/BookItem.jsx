import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { BooksContext } from "../context/BooksContext";
import styled from "styled-components";
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


/* Styled Components */
const BookContainer = styled.li`
  display: flex;
  align-items: center;
  border: 1px solid rgb(194, 163, 189);
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: rgb(255, 255, 255);
  width: 30%;
`;

const BookImage = styled.img`
  width: 100px;
  height: 150px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const BookDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align:left;
`;

const BookTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const BookInfo = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 5px;
  justify-content: space-between;
`;

// Estilos para el contenedor del modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};


/**
 * Componente que representa un libro individual en la lista de libros. 
 * Permite editar, eliminar y marcar como leído/no leído un libro, además de mostrar su información.
 */
const BookItem = ({ id, titulo, autor, anio, genero, leido, puntuacion, url }) => {
  const { updateBook, deleteBook } = useContext(BooksContext); // funciones updateBook y deleteBook del contexto global
  const [isEditing, setIsEditing] = useState(false); // controla si un libro esta en modo edición
  const [editedBook, setEditedBook] = useState({ titulo, autor, anio, genero, puntuacion, leido, url }); // almacena los datos editados

  // Actualiza editedBook con los valores actualizados
  const handleChange = (e) => {
    setEditedBook({
      ...editedBook,
      [e.target.name]: e.target.name === "puntuacion" ? Number(e.target.value) : e.target.value,
    });
  };

  // Actualiza el libro editado y sale del modo edición
  const handleSave = () => {
    updateBook(id, editedBook);
    setIsEditing(false);
  };

  // Maneja la eliminación de un libro, muestra una ventana de confirmación
  const handleDelete = () => {
    if (window.confirm(`¿Seguro que quieres eliminar "${titulo}"?`)) {
      deleteBook(id);
    }
  };

  // Función para marcar un libro como leído o no leído
  const handleToggleLeido = () => {
    const nuevoEstadoLeido = !editedBook.leido;
  
    updateBook(id, {
      ...editedBook,
      leido: nuevoEstadoLeido,
      puntuacion: nuevoEstadoLeido ? editedBook.puntuacion : undefined, // Si no está leído, borra la puntuación
    });
  };

  return (
    <BookContainer>
      {url && <BookImage src={url} alt={`Portada de ${titulo}`} />}
      <BookDetails>
        <BookTitle>{titulo}</BookTitle>
        <BookInfo>{autor} ({anio})</BookInfo>
        <BookInfo>{genero}</BookInfo>
        {leido && (
          <Rating
            name={`rating-${id}`}
            value={editedBook.puntuacion || 0}
            precision={0.5}
            onChange={(event, newValue) => {
              setEditedBook({ ...editedBook, puntuacion: newValue });
              updateBook(id, { ...editedBook, puntuacion: newValue });
            }}
          />
        )}
        <ButtonGroup>
          <div>
            <Button variant="outlined" color="primary" size="small" sx={{ marginRight: '10px' }} onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button variant="contained" color= "primary"  size="small" onClick={handleToggleLeido}>
              {leido ? "No leído" : "Leído"}
            </Button>
          </div>
          <IconButton color="secondary" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </ButtonGroup>
      </BookDetails>

      {/* Modal de Material-UI */}
      <Modal open={isEditing} onClose={() => setIsEditing(false)}>
        <Box sx={modalStyle}>
          <h3>Editar libro</h3>
          <form onSubmit={handleSave}>
            <TextField fullWidth label="Título" name="titulo" value={editedBook.titulo} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Autor" name="autor" value={editedBook.autor} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Año" name="anio" type="number" value={editedBook.anio} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Género" name="genero" value={editedBook.genero} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="URL de la portada" name="url" value={editedBook.url} onChange={handleChange} margin="normal" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Guardar</Button>
            <Button onClick={() => setIsEditing(false)} variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }}>Cancelar</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </BookContainer>
  );
};

// Validación de PropTypes
BookItem.propTypes = {
  id: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  autor: PropTypes.string.isRequired,
  anio: PropTypes.number.isRequired,
  genero: PropTypes.string.isRequired,
  leido: PropTypes.bool.isRequired,
  puntuacion: PropTypes.number,
  url: PropTypes.string,
};

export default BookItem;
