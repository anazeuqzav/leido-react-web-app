import { useState, useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import Buscador from "./Buscador";
import BookItem from "./BookItem";
import AddBookForm from "./AddBookForm";
import FiltroGenero from "./FiltroGenero";


const LibrosPorLeer = () => {
    const { librosPorLeer } = useContext(BooksContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooks, setFilteredBooks] = useState(librosPorLeer);

    // Filtrar por búsqueda y por género
    const searchFilteredBooks = filteredBooks.filter(
        (book) =>
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Libros por Leer</h2>
            <AddBookForm defaultLeido={false} />
            <Buscador onSearch={setSearchTerm} />
            <FiltroGenero books={librosPorLeer} setFilteredBooks={setFilteredBooks} />
            <ul>
                {searchFilteredBooks.map((book) => (
                    <BookItem key={book.id} {...book} />
                ))}
            </ul>
        </div>
    );
};

export default LibrosPorLeer;
