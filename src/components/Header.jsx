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
  padding: 15px 70px 0px 170px;
  height: 150px
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin: 0;
`;

const LogoutButton = styled.button`
  padding: 8px 15px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

/**
 * Encabezado de la página web con un saludo al usuario y un botón de logout.
 */
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <Title>Biblioteca de {user?.username}</Title>
      <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
    </HeaderContainer>
  );
};

export default Header;
