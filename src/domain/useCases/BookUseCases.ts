import { Book, BookDTO } from '../entities/Book';
import { BookRepository } from '../ports/BookRepository';

/**
 * Book use cases that encapsulate the business logic for book operations
 */
export class BookUseCases {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  /**
   * Get all books for a user
   * @param userId The user ID
   * @returns Promise with array of books
   */
  async getBooks(userId: string): Promise<Book[]> {
    return this.bookRepository.getBooks(userId);
  }

  /**
   * Add a new book
   * @param book The book to add
   * @returns Promise with the added book
   */
  async addBook(book: BookDTO): Promise<Book> {
    return this.bookRepository.addBook(book);
  }

  /**
   * Update a book
   * @param id The book ID
   * @param book The book data to update
   * @returns Promise with the updated book
   */
  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    return this.bookRepository.updateBook(id, book);
  }

  /**
   * Delete a book
   * @param id The book ID
   * @returns Promise with boolean indicating success
   */
  async deleteBook(id: string): Promise<boolean> {
    return this.bookRepository.deleteBook(id);
  }

  /**
   * Get read books for a user
   * @param books Array of books
   * @returns Array of read books
   */
  getReadBooks(books: Book[]): Book[] {
    return books.filter((book) => book.status === 'read');
  }

  /**
   * Get unread books for a user
   * @param books Array of books
   * @returns Array of unread books
   */
  getUnreadBooks(books: Book[]): Book[] {
    return books.filter((book) => book.status === 'to-read');
  }

  /**
   * Get favorite books for a user
   * @param books Array of books
   * @returns Array of favorite books (rating = 5)
   */
  getFavoriteBooks(books: Book[]): Book[] {
    return books.filter((book) => book.rating === 5);
  }
}
