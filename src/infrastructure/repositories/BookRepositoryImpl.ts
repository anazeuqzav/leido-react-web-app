import axios from 'axios';
import config from '../../config/api';
import { Book, BookDTO } from '../../domain/entities/Book';
import { getAuthHeaders, handleAuthError } from '../utils/authUtils';
import { BookRepository } from '../../application/interfaces/BookRepository';

/**
 * Implementation of the BookRepository interface
 */
export class BookRepositoryImpl implements BookRepository {
  private API_URL = config.API_URL;

  /**
   * Get all books for a user
   * @param userId The user ID
   * @returns Promise with array of books
   */
  async getBooks(userId: string): Promise<Book[]> {
    try {
      const response = await axios.get(`${this.API_URL}/books`, {
        params: { userId },
        headers: getAuthHeaders()
      });

      // Check if the response has the expected structure
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log('Books received from API:', response.data.data);
        return response.data.data as Book[];
      } else {
        console.error('Unexpected API response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Add a new book
   * @param book The book to add
   * @returns Promise with the added book
   */
  async addBook(book: BookDTO): Promise<Book> {
    try {
      console.log('Adding book to API:', JSON.stringify(book, null, 2));

      const response = await axios.post(`${this.API_URL}/books`, book, {
        headers: getAuthHeaders()
      });

      // Check if the response has the expected structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data as Book;
      } else {
        console.error('Unexpected API response format:', response.data);
        throw new Error('Failed to add book: Unexpected API response format');
      }
    } catch (error: any) {
      console.error('Error adding book:', error);

      if (error.response?.data?.message) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
        throw new Error(`Server error: ${error.response.data.message}`);
      }

      throw error;
    }
  }

  /**
   * Update a book
   * @param id The book ID
   * @param book The book data to update
   * @returns Promise with the updated book
   */
  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    try {
      // Filtrar campos nulos para evitar errores de validación
      const filteredBook: Partial<Book> = {};

      // Solo incluir campos que no sean null o undefined
      Object.entries(book).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Usar una aserción de tipo para evitar errores de TypeScript
          filteredBook[key as keyof Book] = value as any;
        }
      });

      console.log('Updating book in API:', filteredBook);

      const response = await axios.put(`${this.API_URL}/books/${id}`, filteredBook, {
        headers: getAuthHeaders()
      });

      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        console.error('Unexpected API response format:', response.data);
        throw new Error('Failed to update book: Unexpected API response format');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Delete a book
   * @param id The book ID
   * @returns Promise with boolean indicating success
   */
  async deleteBook(id: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${this.API_URL}/books/${id}`, {
        headers: getAuthHeaders()
      });

      if (response.data && response.data.success) {
        return true;
      } else {
        console.error('Unexpected API response format:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      handleAuthError(error);
      throw error;
    }
  }
}
