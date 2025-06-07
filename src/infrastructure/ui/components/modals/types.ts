import { Book } from '../../../../domain/entities/Book';

export interface AddBookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date | null, readDate: Date | null, rating: number | null) => void;
  initialStartDate?: Date;
  initialReadDate?: Date;
  initialRating?: number;
}

export interface UpdateReadDateModalProps {
  book: Book;
  onClose: () => void;
  onBookUpdated?: (bookId: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}
