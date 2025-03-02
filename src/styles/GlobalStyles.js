import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #fffbfe;
    background-image: url("src/assets/Background.png")
  }

  h1, h2, h3, nav {
    font-family: 'Anton', sans-serif;
  }
`;

export default GlobalStyles;