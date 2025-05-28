import { Recommendation } from '../../domain/entities/Recommendation';
import { RecommendationRepository } from '../../domain/ports/RecommendationRepository';
import { apiClient } from '../api/apiClient';

export class RecommendationRepositoryImpl implements RecommendationRepository {
  async getRecommendations(): Promise<Recommendation | null> {
    try {
      const response = await apiClient.get('/recommendations');
      
      if (response.data) {
        // Convertir la fecha de timestamp a objeto Date
        if (response.data.timestamp) {
          response.data.timestamp = new Date(response.data.timestamp);
        }
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      throw error;
    }
  }

  async generateRecommendations(): Promise<Recommendation | null> {
    try {
      const response = await apiClient.post('/recommendations/generate');
      
      if (response.data) {
        // Convertir la fecha de timestamp a objeto Date
        if (response.data.timestamp) {
          response.data.timestamp = new Date(response.data.timestamp);
        }
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error al generar recomendaciones:', error);
      throw error;
    }
  }
}
