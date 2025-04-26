import { useState } from "react";
import Header from "../components/Header";
import Nav from "../components/Nav";
import ReadBooks from "../components/ReadBooks";
import UnreadBooks from "../components/UnreadBooks";
import FavoriteBooks from "../components/FavoriteBooks";
import SearchBar from "../components/SearchBar";
import  SearchResultsList  from "../components/SearchResultsList";

const Home = () => {
  const [listaActual, setListaActual] = useState("leidos"); // Estado para cambiar lista
  const [results, setResults] = useState([]); // Estado para resultados de búsqueda

  return (
    <div style={{ position: "relative" }}>
      <Header />
      <Nav setListaActual={setListaActual} />
      
      {/* Buscador */}
      <div style={{ position: "relative", width: "50%", margin: "20px auto" }}>
        <SearchBar setResults={setResults} />
        {results.length > 0 && <SearchResultsList results={results} />}
      </div>

      {/* Libros */}
      <div>
        {listaActual === "leidos" && <ReadBooks />}
        {listaActual === "porLeer" && <UnreadBooks />}
        {listaActual === "favoritos" && <FavoriteBooks />}
      </div>
    </div>
  );
};

export default Home;


