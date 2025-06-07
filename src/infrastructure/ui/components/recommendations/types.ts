import { RecommendationItem as RecommendationItemType } from '../../../../domain/entities/Recommendation';

export interface RecommendationItemProps {
  recommendation: RecommendationItemType;
  viewMode?: 'grid' | 'list';
}

export interface RecommendationsViewProps {
  recommendations: RecommendationItemType[];
  isLoading: boolean;
  error: string | null;
  refreshing: boolean;
  searchTerm: string;
  viewMode: 'grid' | 'list';
  onRefresh: () => void;
  onSearchChange: (term: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export interface RecommendationFilters {
  genre?: string;
  author?: string;
  rating?: number;
}
