import { useContext, useState } from "react";
import { BooksContext } from "../context/BooksContext";
import BookItem from "./BookItem";
import Buscador from "./Buscador";
import FiltroGenero from "./FiltroGenero";


const LibrosFavoritos = () => {
    const { librosFavoritos } = useContext(BooksContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooks, setFilteredBooks] = useState(librosFavoritos);

    // Filtrar por búsqueda y por género
    const searchFilteredBooks = filteredBooks.filter(
        (book) =>
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Libros Favoritos</h2>
            <Buscador onSearch={setSearchTerm} />
            <FiltroGenero books={librosFavoritos} setFilteredBooks={setFilteredBooks} />
            <ul>
                {searchFilteredBooks.map((book) => (
                    <BookItem key={book.id} {...book} />
                ))}
            </ul>
        </div>
    );
};

export default LibrosFavoritos;
