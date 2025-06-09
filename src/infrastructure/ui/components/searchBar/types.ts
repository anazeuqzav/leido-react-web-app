import { SearchBook } from '../../../../domain/entities/SearchBook';

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  setResults?: (results: SearchResultItem[]) => void;
}

export interface SearchResultItem {
  key: string;
  id?: string; // OLID or other identifier for cover URL
  title: string;
  author?: string;
  cover?: string; // Direct cover URL
  cover_i?: number; // Cover ID from Open Library API
  author_name?: string | string[]; // For API response compatibility
}


export interface SearchResultsListProps {
  results: SearchResultItem[];
}

export interface SearchSuggestion {
  text: string;
  category?: string;
}

export interface SearchFilters {
  title?: string;
  author?: string;
  year?: number;
  language?: string;
}

export interface SearchResultProps {
  result: {
    key: string;
    title: string;
    author?: string;
    coverId?: number;
    author_name?: string[];
    cover_i?: number;
    cover?: string;
  };
}