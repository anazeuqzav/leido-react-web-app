import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchResultProps } from './types';

/**
 * Component that displays a single search result
 */
const SearchResult = ({ result }: SearchResultProps) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = React.useState(false);

  const handleClick = () => {
    const id = result.key.split("/works/")[1] || result.key;
    navigate(`/book/${id}`);
  };

  // Get cover image URL if available
  const getCoverUrl = () => {
    if (imgError) return "https://via.placeholder.com/50x75?text=No+Cover";
    if (result.cover) return result.cover;
    return "https://via.placeholder.com/50x75?text=No+Cover";
  };

  // Format author name
  const formatAuthor = (author: any) => {
    if (!author) return 'Unknown Author';
    if (Array.isArray(author)) {
      return author.length > 0 ? author.join(', ') : 'Unknown Author';
    }
    return author || 'Unknown Author';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgError(true);
    const target = e.target as HTMLImageElement;
    target.src = "https://via.placeholder.com/50x75?text=No+Cover";
  };

  return (
    <div
      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <div className="w-10 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
        <img
          src={getCoverUrl()}
          alt={`Cover of ${result.title || 'book'}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="font-bold text-sm text-gray-800 truncate">
          {result.title || 'Untitled'}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {formatAuthor(result.author || result.author_name)}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
