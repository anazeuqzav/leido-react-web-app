/**
 * Book entity representing a book in the system
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  year?: number;
  genre?: string;
  status: 'read' | 'to-read';
  rating?: number;
  cover?: string;
  userId: string;
  readDate?: Date;
  startDate?: Date;
  externalId?: string; // Identificador único de OpenLibrary (OLID) u otra API
}

/**
 * BookDTO for creating a new book
 */
export interface BookDTO {
  title: string;
  author: string;
  year?: number;
  genre?: string;
  status: 'read' | 'to-read';
  rating?: number;
  cover?: string;
  userId: string;
  readDate?: Date;
  startDate?: Date;
  externalId?: string; // Identificador único de OpenLibrary (OLID) u otra API
}
