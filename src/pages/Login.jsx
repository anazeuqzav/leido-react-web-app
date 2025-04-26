import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react"; // Iconos

/* Styled Components */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const AppTitle = styled.h1`
  font-family: "Anton", sans-serif;
  font-size: 80px;
  color: #0d4341;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #555;
  margin-top: 5px;
  text-align: center;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginForm = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 10px;
`;

const LoginTitle = styled.h2`
  margin-bottom: 15px;
  color: #0d4341;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 97%;
  padding: 10px 0px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
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

const Button = styled.button`
  background: #0d4341;
  font-weight: bold;
  color: white;
  border: 2px solid #0d4341;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background:rgb(255, 66, 170);
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/"); // Redirige al home después de un login exitoso
    } else {
      alert("Email o contraseña incorrectos");
    }
  };

  return (
    <Wrapper>
    <TitleContainer>
       <AppTitle>LEÍDO</AppTitle>
        <Subtitle>Tu biblioteca, siempre contigo</Subtitle>
    </TitleContainer>
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Iniciar Sesión</LoginTitle>
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

        <Button type="submit">Entrar</Button>
        <Text>
          ¿No tienes cuenta? <StyledLink to="/register">Regístrate aquí</StyledLink>
        </Text>
      </LoginForm>
    </LoginContainer>
    </Wrapper>
  );
};

export default Login;

