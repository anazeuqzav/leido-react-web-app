import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

export interface SearchBarProps {
  onSearch?: (term: string) => void;
  setResults?: (results: any[]) => void;
}

/**
 * Component for inputting search queries
 */
const SearchBar = ({ onSearch, setResults }: SearchBarProps) => {
  const [input, setInput] = useState("");

  const fetchData = async (value: string) => {
    if (!value || !setResults) {
      setResults?.([]);
      return;
    }

    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(value + " language:eng")}`);
      const books = response.data.docs.map((doc: any) => ({
        title: doc.title,
        author: doc.author_name ? doc.author_name[0] : "Unknown Author",
        coverId: doc.cover_i,
        key: doc.key,
      }));

      setResults(books.slice(0, 5)); // limitar a 5 resultados
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (value: string) => {
    setInput(value);
    
    if (onSearch) {
      onSearch(value);
    }
    
    if (setResults) {
      fetchData(value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white rounded-full shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-teal-800">
        <FaSearch className="text-gray-500" />
        <input
          className="bg-transparent border-none text-sm text-gray-700 w-full ml-2 focus:outline-none"
          placeholder="Buscar libros..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
