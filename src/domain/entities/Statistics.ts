/**
 * Estadísticas de lectura por mes
 */
export interface MonthlyReadStats {
  month: string;
  count: number;
}

/**
 * Estadísticas de géneros
 */
export interface GenreStats {
  genre: string;
  count: number;
}

/**
 * Estadísticas de autores
 */
export interface AuthorStats {
  author: string;
  count: number;
}

/**
 * Estadísticas de calificaciones
 */
export interface RatingStats {
  rating: number;
  count: number;
}

/**
 * Clasificación de libros
 */
export interface BookRanking {
  id: string;
  title: string;
  author: string;
  rating: number;
  cover?: string | null;
}

/**
 * Mejor mes de lectura
 */
export interface BestMonth {
  month: string;
  year: number;
  count: number;
}

/**
 * Estadísticas de usuario
 */
export interface UserStatistics {
  totalBooks: number;
  monthlyReads: MonthlyReadStats[];
  bestMonth: BestMonth | null;
  topGenres: GenreStats[];
  mostReadGenre: GenreStats | null;
  topAuthors: AuthorStats[];
  topFiveAuthors: AuthorStats[];
  ratingDistribution: RatingStats[];
  topRatedBooks: BookRanking[];
}
