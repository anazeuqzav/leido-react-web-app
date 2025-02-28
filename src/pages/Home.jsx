
import LibrosLeidos from "../components/LibrosLeidos";
import LibrosPorLeer from "../components/LibrosPorLeer";
import LibrosFavoritos from "../components/LibrosFavoritos";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirige a la página de login
  };

  return (
    <div>
      <h2>Mi Biblioteca</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <LibrosLeidos />
      <LibrosPorLeer />
      <LibrosFavoritos />
    </div>
  );
};

export default Home;
