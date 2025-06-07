import { Book, BookDTO } from '../../domain/entities/Book';

/**
 * Interface for the Book Repository
 * Defines methods for interacting with the book data source
 */
export interface BookRepository {
  getBooks(userId: string): Promise<Book[]>;
  addBook(book: BookDTO): Promise<Book>;
  updateBook(id: string, book: Partial<Book>): Promise<Book>;
  deleteBook(id: string): Promise<boolean>;
}
