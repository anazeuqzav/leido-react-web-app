import React, { useState, useContext, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { SearchContext } from '../../context/SearchContext';
import { SearchBarProps, SearchResultItem } from './types';

/**
 * Component for inputting search queries
 */
const SearchBar = ({ onSearch, setResults }: SearchBarProps) => {
  const [input, setInput] = useState("");
  const { searchBooks, searchResults } = useContext(SearchContext);

  // Update results when search results change
  useEffect(() => {
    if (setResults) {
      // The repository already formats the results with cover URLs
      const formattedResults = searchResults.map(book => ({
        key: book.key,
        id: book.id,
        title: book.title,
        author: Array.isArray(book.author_name) ? book.author_name.join(', ') : book.author_name || 'Unknown Author',
        author_name: book.author_name || [],
        cover: book.cover
      }));
      setResults(formattedResults);
    }
  }, [searchResults, setResults]);

  const handleChange = (value: string) => {
    setInput(value);
    
    if (!value.trim()) {
      setResults?.([]);
      return;
    }
    
    if (onSearch) {
      onSearch(value);
    } else {
      searchBooks(value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white rounded-full shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-teal-800">
        <FaSearch className="text-gray-500" />
        <input
          className="bg-transparent border-none text-sm text-gray-700 w-full ml-2 focus:outline-none"
          placeholder="Search books by title or author..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
