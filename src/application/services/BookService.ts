import { Book, BookDTO } from '../../domain/entities/Book';
import { BookUseCases } from '../../domain/useCases/BookUseCases';

/**
 * Book service that coordinates book-related operations
 */
export class BookService {
  private bookUseCases: BookUseCases;

  constructor(bookUseCases: BookUseCases) {
    this.bookUseCases = bookUseCases;
  }

  /**
   * Get all books for a user
   * @param userId The user ID
   * @returns Promise with array of books
   */
  async getBooks(userId: string): Promise<Book[]> {
    return this.bookUseCases.getBooks(userId);
  }

  /**
   * Add a new book
   * @param book The book to add
   * @returns Promise with the added book
   */
  async addBook(book: BookDTO): Promise<Book> {
    return this.bookUseCases.addBook(book);
  }

  /**
   * Update a book
   * @param id The book ID
   * @param book The book data to update
   * @returns Promise with the updated book
   */
  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    return this.bookUseCases.updateBook(id, book);
  }

  /**
   * Delete a book
   * @param id The book ID
   * @returns Promise with boolean indicating success
   */
  async deleteBook(id: string): Promise<boolean> {
    return this.bookUseCases.deleteBook(id);
  }

  /**
   * Get read books for a user
   * @param books Array of books
   * @returns Array of read books
   */
  getReadBooks(books: Book[]): Book[] {
    return this.bookUseCases.getReadBooks(books);
  }

  /**
   * Get unread books for a user
   * @param books Array of books
   * @returns Array of unread books
   */
  getUnreadBooks(books: Book[]): Book[] {
    return this.bookUseCases.getUnreadBooks(books);
  }

  /**
   * Get favorite books for a user
   * @param books Array of books
   * @returns Array of favorite books (rating = 5)
   */
  getFavoriteBooks(books: Book[]): Book[] {
    return this.bookUseCases.getFavoriteBooks(books);
  }
}
