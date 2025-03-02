import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

/* Styled Components */
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0d4341;
  color: white;
  padding: 15px 5vw 0px 10vw;
  height: 150px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 18px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background-color: #c82333;
  }

  &:focus {
    outline: 2px solid white;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.9rem;
  }
`;

/**
 * Encabezado de la página web con un saludo al usuario y un botón de logout.
 */
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Maneja el cierre de sesión del usuario.
   * Llama a la función `logout()` del contexto de autenticación y redirige a la página de inicio de sesión.
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <Title>Biblioteca de {user?.username || "Invitado"}</Title>
      <LogoutButton onClick={handleLogout} aria-label="Cerrar sesión">
        Cerrar Sesión
      </LogoutButton>
    </HeaderContainer>
  );
};

export default Header;