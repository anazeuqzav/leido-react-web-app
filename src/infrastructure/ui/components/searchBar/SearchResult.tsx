import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchResultProps } from './types';

/**
 * Component that displays a single search result
 */
const SearchResult = ({ result }: SearchResultProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const id = result.key.split("/works/")[1];
    navigate(`/book/${id}`);
  };
  
  // Get cover image URL if available
  const coverUrl = result.cover || (result.coverId || result.cover_i
    ? `https://covers.openlibrary.org/b/id/${result.coverId || result.cover_i}-M.jpg` 
    : "https://via.placeholder.com/50x75?text=No+Cover");

  return (
    <div
      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <img
        src={coverUrl}
        alt={`Cover of ${result.title}`}
        className="w-10 h-16 object-cover rounded"
      />
      <div className="flex flex-col">
        <div className="font-bold text-sm text-gray-800">{result.title}</div>
        <div className="text-xs text-gray-500">
          {result.author || (result.author_name && result.author_name.join(', ')) || "Unknown Author"}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;