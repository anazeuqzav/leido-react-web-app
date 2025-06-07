import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExploreIcon from '@mui/icons-material/Explore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchBar from '../searchBar/SearchBar';
import SearchResultsList from '../searchBar/SearchResultsList';
import { NavProps } from './types';

const logoPath = '/src/assets/logo.png';

/**
 * Navigation component for the application
 */
const Nav: React.FC<NavProps> = ({ setCurrentList }) => {
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

  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-teal-800 to-teal-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and application name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logoPath}
                alt="Leído Logo"
                className="h-10 w-10 object-contain filter drop-shadow-md"
              />
              <span className="text-white font-bold text-xl tracking-tight hidden sm:block">LEÍDO</span>
            </Link>
          </div>

          {/* Search bar visible in all sizes */}
          <div className="flex-1 max-w-md mx-4 relative" ref={resultsRef}>
            <SearchBar setResults={setResults} />
            {results.length > 0 && (
              <div className="absolute w-full z-50 mt-1">
                <SearchResultsList results={results} />
              </div>
            )}
          </div>

          {/* Navigation menu for medium and large screens */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link
              to="/read"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/read')
                ? 'bg-teal-900 text-white'
                : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
            >
              <MenuBookIcon fontSize="small" />
              <span>Read</span>
            </Link>

            <Link
              to="/want-to-read"
              onClick={() => handleListChange("wantToRead")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/want-to-read')
                ? 'bg-teal-900 text-white'
                : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
            >
              <BookmarkIcon fontSize="small" />
              <span>To Read</span>
            </Link>

            <Link
              to="/favorites"
              onClick={() => handleListChange("favorites")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/favorites')
                ? 'bg-teal-900 text-white'
                : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
            >
              <FavoriteIcon fontSize="small" />
              <span>Favorites</span>
            </Link>

            <Link
              to="/recommendations"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/recommendations')
                ? 'bg-teal-900 text-white'
                : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
            >
              <ExploreIcon fontSize="small" />
              <span>Recommendations</span>
            </Link>

            <Link
              to="/statistics"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/statistics')
                ? 'bg-teal-900 text-white'
                : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
            >
              <BarChartIcon fontSize="small" />
              <span>Statistics</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-1 shadow-sm"
            >
              <ExitToAppIcon fontSize="small" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-100 hover:text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={menuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on state */}
      <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-teal-800 shadow-inner">
          <Link
            to="/read"
            onClick={() => {
              handleListChange("read");
              setMenuOpen(false);
            }}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/read')
              ? 'bg-teal-900 text-white'
              : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
          >
            <div className="flex items-center space-x-2">
              <MenuBookIcon fontSize="small" />
              <span>Read Books</span>
            </div>
          </Link>

          <Link
            to="/want-to-read"
            onClick={() => {
              handleListChange("wantToRead");
              setMenuOpen(false);
            }}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/want-to-read')
              ? 'bg-teal-900 text-white'
              : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
          >
            <div className="flex items-center space-x-2">
              <BookmarkIcon fontSize="small" />
              <span>Want to Read</span>
            </div>
          </Link>

          <Link
            to="/favorites"
            onClick={() => {
              handleListChange("favorites");
              setMenuOpen(false);
            }}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/favorites')
              ? 'bg-teal-900 text-white'
              : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
          >
            <div className="flex items-center space-x-2">
              <FavoriteIcon fontSize="small" />
              <span>Favorite Books</span>
            </div>
          </Link>

          <Link
            to="/recommendations"
            onClick={() => setMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/recommendations')
              ? 'bg-teal-900 text-white'
              : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
          >
            <div className="flex items-center space-x-2">
              <ExploreIcon fontSize="small" />
              <span>Recommendations</span>
            </div>
          </Link>

          <Link
            to="/statistics"
            onClick={() => setMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/statistics')
              ? 'bg-teal-900 text-white'
              : 'text-teal-100 hover:bg-teal-600 hover:text-white'}`}
          >
            <div className="flex items-center space-x-2">
              <BarChartIcon fontSize="small" />
              <span>Statistics</span>
            </div>
          </Link>

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <ExitToAppIcon fontSize="small" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;