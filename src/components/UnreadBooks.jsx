import { useState, useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import Searcher from "./Searcher";
import BookItem from "./BookItem";
import styled from "styled-components";
import AddBookForm from "./AddBookForm";
import Filter from "./Filter";

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
 * Lista de libros por leer
 */
const UnreadBooks = () => {
    const { unreadBooks, error } = useContext(BooksContext); // listra filtrada de libros sin leer desde el contexto
    const [searchTerm, setSearchTerm] = useState(""); // termino de busqueda
    const [filteredBooks, setFilteredBooks] = useState(unreadBooks); // filtro de género

    // Filtrar por búsqueda y por género
    const searchFilteredBooks = filteredBooks.filter(
        (book) =>
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <BooksContainer>
            <Title>Libros por leer</Title>
            <Searcher onSearch={setSearchTerm} />
            <AddBookForm defaultLeido={true} />
            <Filter books={unreadBooks} setFilteredBooks={setFilteredBooks} />

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <BookList>
                {searchFilteredBooks.map((book) => (
                    <BookItem key={book.id} {...book} />
                ))}
            </BookList>
        </BooksContainer>
    );
};

export default UnreadBooks;
