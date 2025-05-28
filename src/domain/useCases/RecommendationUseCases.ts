import { Recommendation } from '../entities/Recommendation';
import { RecommendationRepository } from '../ports/RecommendationRepository';

export class RecommendationUseCases {
  constructor(private recommendationRepository: RecommendationRepository) {}

  async getRecommendations(): Promise<Recommendation | null> {
    return this.recommendationRepository.getRecommendations();
  }

  async generateRecommendations(): Promise<Recommendation | null> {
    return this.recommendationRepository.generateRecommendations();
  }
}
