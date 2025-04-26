import { useState, useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import Searcher from "./Searcher";
import styled from "styled-components";
import BookItem from "./BookItem";
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
 * Lista de libros leídos
 */
const ReadBooks = () => {
  const { readBooks, error } = useContext(BooksContext); // la lista de libros leídos filtrada desde el contexto global
  const [searchTerm, setSearchTerm] = useState(""); // termino de búsqueda
  const [filteredBooks, setFilteredBooks] = useState(readBooks); // filtro por genero 

  // Filtrar por búsqueda y por género
  const searchFilteredBooks = filteredBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BooksContainer>
      <Title>Libros leídos</Title>
      <Searcher onSearch={setSearchTerm} />
      <AddBookForm defaultLeido={'read'} />
      <Filter books={readBooks} setFilteredBooks={setFilteredBooks} />
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <BookList>
        {searchFilteredBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </BookList>
    </BooksContainer>
  );
};

export default ReadBooks;

