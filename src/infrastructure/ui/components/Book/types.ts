import { Book } from '../../../../domain/entities/Book';

export interface BookItemProps extends Book {
  viewMode?: 'grid' | 'list' | 'compact';
}

export interface BookDisplayProps {
  book: Book;
  viewMode: 'grid' | 'list' | 'compact';
  onViewDetails: (event: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export interface BookActionsProps {
  book: Book;
  viewMode: 'grid' | 'list' | 'compact';
  onToggleStatus?: (event: React.MouseEvent) => void;
  onEditDates?: (event: React.MouseEvent) => void;
  onRatingChange?: (value: number | null) => void;
}

export interface BookRatingProps {
  id: string;
  rating: number | undefined;
  onChange: (value: number | null) => void;
  size?: 'small' | 'medium' | 'large';
}
