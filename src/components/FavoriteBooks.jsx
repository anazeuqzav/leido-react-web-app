import { useContext, useState } from "react";
import { BooksContext } from "../context/BooksContext";
import BookItem from "./BookItem";
import styled from "styled-components";
import Searcher from "./Searcher";
import Filter from "./Filter";

/* Styled Components */

// Contenedor de la lista
const BooksContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

// Estilización del título
const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #0d4341;
`;

// Lista de libros con flexbox para mejor estructura
const BookList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: stretch;
  gap: 15px;
`;

// Mensaje de error estilizado
const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;


/**
 * Lista de libros favoritos (marcados como 5 estrellas en puntuación)
 */
const FavoriteBooks = () => {
    const { favoriteBooks, error } = useContext(BooksContext); // libros filtrados por favoritos desde el BooksContext
    const [searchTerm, setSearchTerm] = useState(""); // almacena el texto ingresado en el buscador 
    const [filteredBooks, setFilteredBooks] = useState(favoriteBooks); // almacena la lista de libros filrada (por autor y titulo)

    // Filtrar por búsqueda y por género
    const searchFilteredBooks = filteredBooks.filter(
        (book) =>
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <BooksContainer>
            <Title>Libros favoritos</Title>
            <Searcher onSearch={setSearchTerm} />
            <Filter books={favoriteBooks} setFilteredBooks={setFilteredBooks} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <BookList>
                {searchFilteredBooks.map((book) => (
                    <BookItem key={book.id} {...book} />
                ))}
            </BookList>
        </BooksContainer>
    );
};

export default FavoriteBooks;
