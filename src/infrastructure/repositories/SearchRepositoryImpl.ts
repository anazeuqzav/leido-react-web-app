import axios from 'axios';
import config from '../../config/api';
import { SearchBook, BookDetails } from '../../domain/entities/SearchBook';
import { SearchRepository } from '../../application/interfaces/SearchRepository'
/**
 * Implementation of the SearchRepository interface
 */
export class SearchRepositoryImpl implements SearchRepository {
  private API_URL = config.OPEN_LIBRARY_URL;

  /**
   * Search for books
   * @param query The search query
   * @returns Promise with array of search results
   */
  async searchBooks(query: string): Promise<SearchBook[]> {
    try {
      // Encode the query to handle special characters
      const encodedQuery = encodeURIComponent(query + " language:eng");
      
      const response = await axios.get(`${this.API_URL}/search.json?q=${encodedQuery}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.docs) {
        // Map the OpenLibrary response to our SearchBook model
        return response.data.docs
          .filter((doc: any) => doc.title && doc.author_name) // Filter out items without title or author
          .slice(0, 10) // Limit to 10 results
          .map((doc: any) => ({
            key: doc.key,
            title: doc.title,
            author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown',
            cover: doc.cover_i 
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : '/placeholder-cover.jpg',
          }));
      }
      
      return [];
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
      const response = await axios.get(`${this.API_URL}/works/${bookId}.json`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data as BookDetails;
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }
}
