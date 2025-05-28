import { Recommendation } from '../../domain/entities/Recommendation';
import { RecommendationUseCases } from '../../domain/useCases/RecommendationUseCases';

export class RecommendationService {
  constructor(private recommendationUseCases: RecommendationUseCases) {}

  async getRecommendations(): Promise<Recommendation | null> {
    try {
      return await this.recommendationUseCases.getRecommendations();
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      throw error;
    }
  }

  async generateRecommendations(): Promise<Recommendation | null> {
    try {
      return await this.recommendationUseCases.generateRecommendations();
    } catch (error) {
      console.error('Error al generar recomendaciones:', error);
      throw error;
    }
  }
}
