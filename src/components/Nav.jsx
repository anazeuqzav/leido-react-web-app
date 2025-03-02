import styled from "styled-components";
import PropTypes from "prop-types";

/* Styled Components */
const NavBar = styled.nav`
  display: flex;
  background-color:  #0d4341;
  height: 80px;
}
`;

const NavButton = styled.button`
  flex: 1; 
  font-family: Anton;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
  transition: background 0.3s;
  border-radius: 20px;

  &:hover {
    background:rgb(12, 47, 46);;
  }
`;

/**
 * Barra de navegación con las diferentes listas (libros leídos, no leídos y favoritos)
 */
const Nav = ({ setListaActual }) => {
  return (
    <NavBar>
      <NavButton onClick={() => setListaActual("leidos")}>Libros Leídos</NavButton>
      <NavButton onClick={() => setListaActual("porLeer")}>Libros por Leer</NavButton>
      <NavButton onClick={() => setListaActual("favoritos")}>Libros Favoritos</NavButton>
    </NavBar>
  );
};

Nav.propTypes = {
  setListaActual: PropTypes.func.isRequired,
};

export default Nav;
