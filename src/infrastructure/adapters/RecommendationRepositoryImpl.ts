import axios from 'axios';
import { Recommendation } from '../../domain/entities/Recommendation';
import { RecommendationRepository } from '../../domain/ports/RecommendationRepository';
import { getAuthHeaders, handleAuthError } from '../utils/authUtils';

export class RecommendationRepositoryImpl implements RecommendationRepository {
  private API_URL = 'http://localhost:5000/api';

  async getRecommendations(): Promise<Recommendation | null> {
    try {
      const response = await axios.get(`${this.API_URL}/recommendations`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
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
      handleAuthError(error);
      throw error;
    }
  }

  async generateRecommendations(): Promise<Recommendation | null> {
    try {
      const response = await axios.post(`${this.API_URL}/recommendations/generate`, {}, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
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
      handleAuthError(error);
      throw error;
    }
  }
}
