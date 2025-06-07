import React from 'react';
import SearchResult from './SearchResult';
import { SearchResultsListProps, SearchResultItem } from './types';

/**
 * Component that displays a list of search results
 */
const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  // Convert SearchBook to SearchResultItem
  const mapToResultItem = (book: any): SearchResultItem => ({
    key: book.key,
    title: book.title,
    author: Array.isArray(book.author_name) ? book.author_name.join(', ') : book.author_name || 'Unknown Author',
    coverId: book.cover_i ? book.cover_i.toString() : undefined,
  });

  return (
    <div className="w-full bg-white flex flex-col shadow-md rounded-lg mt-2 max-h-72 overflow-y-auto absolute top-12 z-10">
      {results.map((result) => (
        <SearchResult key={result.key} result={mapToResultItem(result)} />
      ))}
    </div>
  );
};

export default SearchResultsList;
