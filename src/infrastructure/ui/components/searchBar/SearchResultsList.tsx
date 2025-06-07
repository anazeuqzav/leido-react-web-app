import React from 'react';
import { SearchBook } from '../../../../domain/entities/SearchBook';
import SearchResult from './SearchResult';

interface SearchResultsListProps {
  results: SearchBook[];
}

/**
 * Component that displays a list of search results
 */
const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  return (
    <div className="w-full bg-white flex flex-col shadow-md rounded-lg mt-2 max-h-72 overflow-y-auto absolute top-12 z-10">
      {results.map((result) => (
        <SearchResult key={result.key} result={result} />
      ))}
    </div>
  );
};

export default SearchResultsList;
