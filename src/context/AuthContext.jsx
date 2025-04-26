// Importaciones
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Crea un contexto para gestionar la autenticación
export const AuthContext = createContext();

// Envuelve la app y provee de la información de los usuarios
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // guarda la información del usuario
  const [token, setToken] = useState(null); // guarda el token tras el login

  // recupera el usuario y el token desde el localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  /**
   * Función para realizar login en la aplicacion. Realiza una petición POST a la API con el email y 
   * la contraseña del usuario. Si existe y coincide en la API guarda el resultado y el token en el localStorage.
   * @param {String} email email del usuario que intenta identificarse
   * @param {String} password contraseña del usuario
   * @returns Si la respuesta es válida devuevel true, sino false.
   */
  const login = async (email, password) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser({ id: data.user._id, username: data.user.username, email: data.user.email });
      setToken(data.token); // Asegúrate de almacenar el token correctamente

      localStorage.setItem("user", JSON.stringify({ id: data.user._id, username: data.user.username, email: data.user.email }));
      localStorage.setItem("token", data.token); // Guarda el token en el localStorage
      return true;
    }
    return false;
  };

  /**
   * Función para deslogearse de la aplicación. Elimina el token y el usuario del localstorage.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /**
   * Envuelve a los hijos y les proporciona la información necesaria para el resto de la aplicación
  como el usuario el token, y las funciones login y logout
   */
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validación de PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
