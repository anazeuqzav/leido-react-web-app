/**
 * Monthly reading statistics
 */
export interface MonthlyReadStats {
  month: string;
  count: number;
}

/**
 * Genre statistics
 */
export interface GenreStats {
  genre: string;
  count: number;
}

/**
 * Author statistics
 */
export interface AuthorStats {
  author: string;
  count: number;
}

/**
 * Rating statistics
 */
export interface RatingStats {
  rating: number;
  count: number;
}

/**
 * Book ranking
 */
export interface BookRanking {
  id: string;
  title: string;
  author: string;
  rating: number;
  cover?: string | null;
}

/**
 * Best reading month
 */
export interface BestMonth {
  month: string;
  year: number;
  count: number;
}

/**
 * User statistics
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
