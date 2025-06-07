import { BookDetails } from '../../../../domain/entities/SearchBook';

export interface EditDatesButtonProps {
    status: string;
    onEditDates: (e: React.MouseEvent) => void;
}

export interface MarkAsReadBtnProps {
  book: BookDetails;
  authorNames: string[];
  coverUrl: string;
  onSuccess: () => void;
}

export interface ToggleStatusButtonProps {
  status: string;
  onToggleStatus: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}
