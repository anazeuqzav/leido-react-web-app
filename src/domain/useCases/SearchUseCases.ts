import { SearchBook, BookDetails } from '../entities/SearchBook';
import { SearchRepository } from '../ports/SearchRepository';

/**
 * Search use cases that encapsulate the business logic for searching books
 */
export class SearchUseCases {
  private searchRepository: SearchRepository;

  constructor(searchRepository: SearchRepository) {
    this.searchRepository = searchRepository;
  }

  /**
   * Search for books
   * @param query The search query
   * @returns Promise with array of search results
   */
  async searchBooks(query: string): Promise<SearchBook[]> {
    return this.searchRepository.searchBooks(query);
  }

  /**
   * Get book details
   * @param bookId The book ID
   * @returns Promise with book details
   */
  async getBookDetails(bookId: string): Promise<BookDetails> {
    return this.searchRepository.getBookDetails(bookId);
  }
}
