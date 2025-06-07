import { MonthlyReadStats, GenreStats, AuthorStats, RatingStats } from '../../../../domain/entities/Statistics';

// Definición local ya que BookStats no existe en la entidad Statistics
export interface BookStats {
  id: string;
  title: string;
  cover?: string | null | undefined;
  author: string;
  rating: number;
}

export interface MonthlyReadChartProps {
  data: MonthlyReadStats[];
}

export interface TopGenresChartProps {
  data: GenreStats[];
  maxItems?: number;
  showLegend?: boolean;
}

export interface TopAuthorsChartProps {
  data: AuthorStats[];
  maxItems?: number;
  showLegend?: boolean;
}

export interface RatingDistributionChartProps {
  data: RatingStats[];
  showLegend?: boolean;
}

export interface TopRatedBooksProps {
  books: BookStats[];
  maxItems?: number;
}

export interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}
