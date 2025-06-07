import { SearchBook, BookDetails } from '../../domain/entities/SearchBook';

/**
 * Interface for the Search Repository
 * Defines methods for searching books from external APIs
 */
export interface SearchRepository {
  searchBooks(query: string): Promise<SearchBook[]>;
  getBookDetails(bookId: string): Promise<BookDetails>;
}
