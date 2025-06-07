import { Book } from '../../../../domain/entities/Book';

export interface SortOption {
  value: string;
  label: string;
}

export interface ViewMode {
  mode: 'grid' | 'list' | 'compact';
  icon: React.ReactNode;
  label: string;
}

export interface BookListProps {
  books: Book[];
  title: string;
  emptyMessage: string;
  showRating?: boolean;
  showStatus?: boolean;
  showActions?: boolean;
  onToggleStatus?: (bookId: string) => void;
  onEditDates?: (bookId: string) => void;
  onRatingChange?: (bookId: string, rating: number | null) => void;
}
