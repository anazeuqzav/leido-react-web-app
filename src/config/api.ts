// Configuración centralizada de APIs
const config = {
  // Usar variables de entorno si están disponibles, o valores por defecto si no
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  OPEN_LIBRARY_URL: import.meta.env.VITE_OPEN_LIBRARY_URL || 'https://openlibrary.org'
};

export default config;
