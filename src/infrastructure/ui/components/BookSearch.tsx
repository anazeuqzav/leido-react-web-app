import React, { useState, useContext, useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import SearchBar from './searchBar/SearchBar';
import SearchResultsList from './searchBar/SearchResultsList';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface BookSearchProps {
  onClose: () => void;
}

/**
 * Component for searching books from external API
 */
const BookSearch: React.FC<BookSearchProps> = ({ onClose }) => {
  const { searchResults, isLoading, error, searchBooks } = useContext(SearchContext);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchBooks(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchBooks]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-teal-800">Search Books</h2>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center my-4">
          <CircularProgress />
        </div>
      ) : (
        searchResults.length > 0 && (
          <div className="mt-4">
            <SearchResultsList results={searchResults} />
          </div>
        )
      )}
    </div>
  );
};

export default BookSearch;
