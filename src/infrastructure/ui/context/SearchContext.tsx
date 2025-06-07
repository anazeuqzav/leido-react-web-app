import React, { createContext, useState, ReactNode } from 'react';
import { SearchBook, BookDetails } from '../../../domain/entities/SearchBook';
import { SearchRepositoryImpl } from '../../repositories/SearchRepositoryImpl';

// Create the repository, use cases, and service
const searchRepository = new SearchRepositoryImpl();

// Define the context type
interface SearchContextType {
  searchResults: SearchBook[];
  isLoading: boolean;
  error: string | null;
  searchBooks: (query: string) => Promise<void>;
  getBookDetails: (bookId: string) => Promise<BookDetails>;
}

// Create the context with a default value
export const SearchContext = createContext<SearchContextType>({
  searchResults: [],
  isLoading: false,
  error: null,
  searchBooks: async () => {},
  getBookDetails: async () => ({} as BookDetails),
});

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search for books
   * @param query The search query
   */
  const searchBooksHandler = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchRepository.searchBooks(query);
      setSearchResults(results);
    } catch (error: any) {
      console.error('Error searching books:', error);
      setError(error.message || 'Error searching books');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get book details
   * @param bookId The book ID
   * @returns Promise with book details
   */
  const getBookDetailsHandler = async (bookId: string): Promise<BookDetails> => {
    try {
      return await searchRepository.getBookDetails(bookId);
    } catch (error: any) {
      console.error('Error fetching book details:', error);
      setError(error.message || 'Error fetching book details');
      throw error;
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        isLoading,
        error,
        searchBooks: searchBooksHandler,
        getBookDetails: getBookDetailsHandler,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
