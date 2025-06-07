import React from 'react';
import SearchResult from './SearchResult';
import { SearchResultsListProps, SearchResultItem } from './types';

/**
 * Component that displays a list of search results
 */
const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  // Convert API response to SearchResultItem format
  const mapToResultItem = (book: SearchResultItem): SearchResultItem => {
    return {
      key: book.key,
      title: book.title,
      author: book.author || 
             (Array.isArray(book.author_name) ? book.author_name.join(', ') : 
             (typeof book.author_name === 'string' ? book.author_name : 'Unknown Author')),
      cover: `https://covers.openlibrary.org/b/olid/${book.id}-M.jpg`,
    };
  };

  if (results.length === 0) {
    return (
      <div className="w-full bg-white p-4 shadow-md rounded-lg mt-2 max-h-72 overflow-y-auto absolute top-12 z-10">
        <p className="text-gray-500 text-center">No results found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col shadow-md rounded-lg mt-2 max-h-72 overflow-y-auto absolute top-12 z-10">
      {results.map((result) => (
        <SearchResult key={result.key} result={mapToResultItem(result)} />
      ))}
    </div>
  );
};

export default SearchResultsList;
