import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookSearch from './BookSearch';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';
import logo from '../../../assets/logo.png';

/**
 * Navigation component for the application
 */
const Nav: React.FC<{ setCurrentList?: (listName: string) => void }> = ({ setCurrentList }) => {
  const [results, setResults] = useState<any[]>([]);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setResults([]); // Clear search results
      }
    };
    // Agrega el evento al montar el componente
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Limpia el evento al desmontar el componente
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleListChange = (listName: string) => {
    if (setCurrentList) {
      setCurrentList(listName);
    }
  };

  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-pink-50 shadow-md border-b border-gray-200 px-4 font-poppins">
      <div className="flex items-center justify-between h-16">
        {/* Botón del menú hamburguesa para pantallas pequeñas */}
        <button
          className="text-gray-700 text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logotipo de la aplicación */}
        <img src={logo} alt="Logo" className="h-10 w-10 ml-4" />

        {/* Contenido para pantallas grandes */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {/* Botones para cambiar entre listas */}
          <div className="flex space-x-16">
            <Link to="/read"
              className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors">
              Read Books
            </Link>
            <Link to="/want-to-read"
              onClick={() => handleListChange("wantToRead")}
              className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors"
            >
              Want to Read
            </Link>
            <Link to="/favorites"
              onClick={() => handleListChange("favorites")}
              className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors"
            >
              Favorite Books
            </Link>
            <Link to="/statistics"
              className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors flex items-center"
            >
              <BarChartIcon className="mr-1" />
              Estadísticas
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative flex-1 max-w-md mx-4" ref={resultsRef}>
            <SearchBar setResults={setResults} />
            {/* Muestra los resultados de búsqueda si existen */}
            {results.length > 0 && <SearchResultsList results={results} />}
          </div>

          {/* Botón para cerrar sesión */}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-white flex items-center"
          >
            <ExitToAppIcon className="mr-1" />
            Log Out
          </button>
        </div>

        {/* Barra de búsqueda y botón de cerrar sesión para pantallas pequeñas */}
        <div className="relative flex-1 max-w-md mx-4 md:hidden">
          <SearchBar setResults={setResults} />
          {results.length > 0 && <SearchResultsList results={results} />}
        </div>
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-white md:hidden flex items-center"
        >
          <ExitToAppIcon className="mr-1" />
          Log Out
        </button>
      </div>

      {/* Hamburger menu dropdown */}
      <div
        className={`md:hidden ${menuOpen ? "block" : "hidden"} absolute top-16 left-0 w-full bg-pink-50 z-10`}
      >
        <div className="flex flex-col space-y-2 px-4 py-2">
          {/* Buttons to switch between lists in hamburger menu */}
          <Link to="/read"
            onClick={() => handleListChange("read")}
            className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors"
          >
            Read Books
          </Link>
          <Link to="/want-to-read"
            onClick={() => handleListChange("wantToRead")}
            className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors"
          >
            Want to Read
          </Link>
          <Link to="/favorites"
            onClick={() => handleListChange("favorites")}
            className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors"
          >
            Favorite Books
          </Link>
          <Link to="/statistics"
            className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors flex items-center"
          >
            <BarChartIcon className="mr-1" />
            Estadísticas
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;