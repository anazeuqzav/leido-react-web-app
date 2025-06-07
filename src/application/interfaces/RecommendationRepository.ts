import { Recommendation } from '../../domain/entities/Recommendation';

export interface RecommendationRepository {
  getRecommendations(): Promise<Recommendation | null>;
  generateRecommendations(): Promise<Recommendation | null>;
}
