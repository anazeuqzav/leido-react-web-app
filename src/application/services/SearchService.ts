import { SearchBook, BookDetails } from '../../domain/entities/SearchBook';
import { SearchUseCases } from '../../domain/useCases/SearchUseCases';

/**
 * Search service that coordinates book search operations
 */
export class SearchService {
  private searchUseCases: SearchUseCases;

  constructor(searchUseCases: SearchUseCases) {
    this.searchUseCases = searchUseCases;
  }

  /**
   * Search for books
   * @param query The search query
   * @returns Promise with array of search results
   */
  async searchBooks(query: string): Promise<SearchBook[]> {
    return this.searchUseCases.searchBooks(query);
  }

  /**
   * Get book details
   * @param bookId The book ID
   * @returns Promise with book details
   */
  async getBookDetails(bookId: string): Promise<BookDetails> {
    return this.searchUseCases.getBookDetails(bookId);
  }
}
