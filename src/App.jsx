import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { BooksProvider } from "./context/BooksContext";
import { useContext } from "react";
import PropTypes from "prop-types";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import GlobalStyles from "./styles/GlobalStyles";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Configura los colores para los componentes de Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d4341', // Color principal
    },
    secondary: {
      main: 'rgb(252, 98, 168)', // Color secundario (botón cancelar, por ejemplo)
    },
    background: {
      paper: '#ffffff', // Fondo del modal
    },
  },
});

// Protege las rutas si el usuario no esta autenticado
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />; // Asegúrate de usar `replace` para evitar problemas de navegación
};


const App = () => {
  return (
    <AuthProvider>
      <BooksProvider>
      <ThemeProvider theme={theme}>
      <GlobalStyles/>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Routes>
        </Router>
        </ThemeProvider>
      </BooksProvider>
    </AuthProvider>
   
  );
};

export default App;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
