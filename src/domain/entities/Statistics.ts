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
 * Estadísticas de usuario
 */
export interface UserStatistics {
  monthlyReads: MonthlyReadStats[];
  topGenres: GenreStats[];
  topAuthors: AuthorStats[];
}
