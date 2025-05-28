import { Recommendation } from '../entities/Recommendation';

export interface RecommendationRepository {
  getRecommendations(): Promise<Recommendation | null>;
  generateRecommendations(): Promise<Recommendation | null>;
}
