import { useState, useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Estilos para contenedor del botón
const ButtonContainer = styled.div`
  margin-bottom: 15px;
  text-align: left;
  margin-left: 40px;  
  margin-right: 50px;
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
 * Formulario para añadir libros a la aplicación
 */
const AddBookForm = ({ defaultLeido }) => {
  const { addBook } = useContext(BooksContext); // función para añadir los libros
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    titulo: "",
    autor: "",
    anio: null,
    genero: "",
    leido: defaultLeido, // dependiendo de si se añade a la lista de libros leídos o no leídos
    puntuacion: defaultLeido ? 1 : undefined,
    url: "",
  });

  // Captura los valores del formulario y los actualiza
  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  // Maneja el añadir un libro 
  const handleSubmit = (e) => {
    e.preventDefault();
    addBook(newBook);
    setNewBook({
      titulo: "",
      autor: "",
      anio: "",
      genero: "",
      leido: defaultLeido,
      puntuacion: 1
    });
    setIsModalOpen(false);// Oculta el formulario después de añadir
  };

  return (
    <>
      <ButtonContainer>
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
        Añadir Libro
      </Button>
      </ButtonContainer>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={modalStyle}>
          <h3>Añadir Nuevo Libro</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <TextField label="Título" name="titulo" value={newBook.titulo} onChange={handleChange} required />
            <TextField label="Autor" name="autor" value={newBook.autor} onChange={handleChange} required />
            <TextField label="Año" name="anio" type="number" value={newBook.anio} onChange={handleChange} required />
            <TextField label="Género" name="genero" value={newBook.genero} onChange={handleChange} required />
            <TextField label="URL de la portada" name="url" value={newBook.url} onChange={handleChange} required />

            {defaultLeido && (
              <TextField
                label="Puntuación"
                name="puntuacion"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={newBook.puntuacion}
                onChange={handleChange}
                required
              />
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">Guardar</Button>
              <Button onClick={() => setIsModalOpen(false)} variant="outlined" color="secondary">Cancelar</Button>
            </Box>

          </form>
        </Box>
      </Modal>
      </>
  );
};
// Validación de PropTypes
AddBookForm.propTypes = {
  defaultLeido: PropTypes.bool.isRequired,
}

export default AddBookForm;
