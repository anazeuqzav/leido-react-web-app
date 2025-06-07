import { Recommendation } from '../../domain/entities/Recommendation';

/**
 * Interface for the Recommendation Repository
 * Defines methods for interacting with the recommendation data source
 */
export interface RecommendationRepository {
  getRecommendations(): Promise<Recommendation | null>;
  generateRecommendations(): Promise<Recommendation | null>;
}
