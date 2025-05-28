import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExploreIcon from '@mui/icons-material/Explore';
import BookSearch from './BookSearch';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';
// Usar una URL relativa para el logo
const logoPath = '/src/assets/logo.png';

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
    // Add the event when mounting the component
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event when unmounting the component
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
        {/* Hamburger menu button for small screens */}
        <button
          className="text-gray-700 text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Application logo */}
        <img src={logoPath} alt="Logo" className="h-10 w-10 ml-4" />

        {/* Content for large screens */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {/* Buttons to switch between lists */}
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

            <Link to="/recommendations"
              className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors flex items-center"
            >
              Recommendations
            </Link>
            <Link to="/statistics"
              className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors flex items-center"
            >
              Statistics
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md mx-4" ref={resultsRef}>
            <SearchBar setResults={setResults} />
            {/* Show search results if they exist */}
            {results.length > 0 && <SearchResultsList results={results} />}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-white flex items-center"
          >
            <ExitToAppIcon className="mr-1" />
            Log Out
          </button>
        </div>

        {/* Search bar and logout button for small screens */}
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

          <Link to="/recommendations"
            className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors flex items-center"
          >
            <ExploreIcon className="mr-1" />
            Recommendations
          </Link>
          <Link to="/statistics"
            className="text-gray-700 text-base font-medium hover:text-teal-600 hover:underline transition-colors flex items-center"
          >
            <BarChartIcon className="mr-1" />
            Statistics
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;