import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react"; // Iconos de la biblioteca lucide react



/* Styled Components */
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const RegisterForm = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 10px;
`;

const Title = styled.h2`
  margin-bottom: 15px;
  color: #0d4341;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;


const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: gray;
`;



const Input = styled.input`
  width: 97%;
  padding: 10px 0px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;


const Button = styled.button`
  background: #0d4341;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background:rgb(255, 66, 170);
    border: 2px solid #0d4341;
  }
`;

const Text = styled.p`
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const StyledLink = styled(Link)`
  color: #0d4341;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;




/**
 * Formulario de registro de usuario, permite a los usuarios crear una cuenta nueva
 * enviando su nombre, email y una contraseña.
 */
const Register = () => {
  const [username, setUsername] = useState(""); // guarda el campo de nombre de usuario
  const [email, setEmail] = useState(""); // guarda el campo del email
  const [password, setPassword] = useState(""); // guarda la contraseña 
  const [showPassword, setShowPassword] = useState(false); // maneja ocultar o mostrar contaseña
  const [message, setMessage] = useState(""); // muestra un mensaje de error o de exito
  const navigate = useNavigate(); // redirige a la página login

  // Maneja el envío del formulario para el registro haciendo una petición POST a la api con el nuevo usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    const newUser = { username, email, password };

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      setMessage("Usuario registrado. Inicie sesión...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage("Error al registrar el usuario.");
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleRegister}> 
      <Title>Registro</Title>
      <Input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputContainer>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <ToggleButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </ToggleButton>
        </InputContainer>
        <Button type="submit">Registrarse</Button>
        <Text>
        ¿Ya tienes cuenta? <StyledLink to="/login">Inicia sesión</StyledLink>
      </Text>
      {message && <p>{message}</p>}
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;

