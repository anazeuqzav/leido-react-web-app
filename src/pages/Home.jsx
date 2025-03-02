import { useState } from "react";
import Header from "../components/Header";
import Nav from "../components/Nav";
import ReadBooks from "../components/ReadBooks";
import UnreadBooks from "../components/UnreadBooks";
import FavoriteBooks from "../components/FavoriteBooks"

const Home = () => {
  const [listaActual, setListaActual] = useState("leidos"); // Estado para cambiar lista

  return (
    <div>
      <Header />
      <Nav setListaActual={setListaActual} />
      <div>
        {listaActual === "leidos" && <ReadBooks />}
        {listaActual === "porLeer" && <UnreadBooks />}
        {listaActual === "favoritos" && <FavoriteBooks />}
      </div>
    </div>
  );
};

export default Home;

