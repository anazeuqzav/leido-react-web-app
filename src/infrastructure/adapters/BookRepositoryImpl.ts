import axios from 'axios';
import { Book, BookDTO } from '../../domain/entities/Book';
import { BookRepository } from '../../domain/ports/BookRepository';

/**
 * Implementation of the BookRepository interface
 */
export class BookRepositoryImpl implements BookRepository {
  private API_URL = 'http://localhost:5000';

  /**
   * Get auth headers with token
   * @returns Headers object with authorization token
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
  }

  /**
   * Get all books for a user
   * @param userId The user ID
   * @returns Promise with array of books
   */
  async getBooks(userId: string): Promise<Book[]> {
    try {
      const response = await axios.get(`${this.API_URL}/api/books`, {
        params: { userId },
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });
      
      // Check if the response has the expected structure
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log('Books received from API:', response.data.data);
        return response.data.data;
      } else {
        console.error('Unexpected API response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching books:', error);
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
      const response = await axios.post(`${this.API_URL}/api/books`, book, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });
      
      // Check if the response has the expected structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        console.error('Unexpected API response format:', response.data);
        throw new Error('Failed to add book: Unexpected API response format');
      }
    } catch (error) {
      console.error('Error adding book:', error);
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
      const response = await axios.put(`${this.API_URL}/api/books/${id}`, book, {
        headers: this.getAuthHeaders(),
      });
      
      // Check if the response has the expected structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        console.error('Unexpected API response format:', response.data);
        throw new Error('Failed to update book: Unexpected API response format');
      }
    } catch (error) {
      console.error('Error updating book:', error);
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
      const response = await axios.delete(`${this.API_URL}/api/books/${id}`, {
        headers: this.getAuthHeaders(),
      });
      
      // Check if the response has the expected structure
      if (response.data && response.data.success) {
        return true;
      } else {
        console.error('Unexpected API response format:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }
}
