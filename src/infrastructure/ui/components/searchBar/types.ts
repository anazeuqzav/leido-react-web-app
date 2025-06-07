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
  author_name?: string | string[]; // For API response compatibility
}

export interface SearchResultProps {
  result: SearchResultItem;
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
