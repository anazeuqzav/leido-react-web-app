export interface RecommendationItem {
  bookId?: string;
  title: string;
  author: string;
  cover?: string | null;
  externalId?: string | null;
  year?: number | null;
  genre?: string | null;
  reason: string;
  score: number;
}

export interface Recommendation {
  id?: string;
  userId: string;
  recommendations: RecommendationItem[];
  timestamp?: Date;
}
