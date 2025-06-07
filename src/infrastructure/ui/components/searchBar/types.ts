import { SearchBook } from '../../../../domain/entities/SearchBook';

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  setResults?: (results: SearchResultItem[]) => void;
}

export interface SearchResultItem {
  key: string;
  title: string;
  author: string;
  coverId?: string;
  coverUrl?: string;
}

export interface SearchResultProps {
  result: SearchResultItem;
}

export interface SearchResultsListProps {
  results: SearchBook[];
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
