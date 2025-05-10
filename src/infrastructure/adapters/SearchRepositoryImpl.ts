import axios from 'axios';
import { SearchBook, BookDetails } from '../../domain/entities/SearchBook';
import { SearchRepository } from '../../domain/ports/SearchRepository';

/**
 * Implementation of the SearchRepository interface
 */
export class SearchRepositoryImpl implements SearchRepository {
  private BASE_URL_OPENLIBRARY = 'https://openlibrary.org';

  /**
   * Search for books
   * @param query The search query
   * @returns Promise with array of search results
   */
  async searchBooks(query: string): Promise<SearchBook[]> {
    try {
      const response = await axios.get(
        `${this.BASE_URL_OPENLIBRARY}/search.json?q=${encodeURIComponent(query)}`
      );
      
      const books: SearchBook[] = response.data.docs.map((doc: any) => ({
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name,
        cover_i: doc.cover_i,
      }));
      
      return books;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  /**
   * Get book details
   * @param bookId The book ID
   * @returns Promise with book details
   */
  async getBookDetails(bookId: string): Promise<BookDetails> {
    try {
      const response = await axios.get(`${this.BASE_URL_OPENLIBRARY}/works/${bookId}.json`);
      return response.data as BookDetails;
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }
}
