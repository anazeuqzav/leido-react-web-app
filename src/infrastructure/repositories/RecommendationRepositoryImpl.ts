import axios from 'axios';
import { Recommendation } from '../../domain/entities/Recommendation';
import { getAuthHeaders, handleAuthError } from '../utils/authUtils';
import { RecommendationRepository } from '../../application/interfaces/RecommendationRepository';

/**
 * Implementation of the RecommendationRepository interface
 * Handles all recommendation-related API calls
 */
export class RecommendationRepositoryImpl implements RecommendationRepository {
  private API_URL = 'http://localhost:5000/api';

  /**
   * Fetches personalized book recommendations for the current user
   * @returns Promise resolving to a Recommendation object or null if no recommendations are available
   * @throws {Error} If there's an error fetching recommendations
   */
  async getRecommendations(): Promise<Recommendation | null> {
    try {
      const response = await axios.get(`${this.API_URL}/recommendations`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (response.data) {
        // Convert timestamp to Date object
        if (response.data.timestamp) {
          response.data.timestamp = new Date(response.data.timestamp);
        }
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Generates personalized book recommendations for the current user
   * @returns Promise resolving to a Recommendation object or null if no recommendations are available
   * @throws {Error} If there's an error generating recommendations
   */
  async generateRecommendations(): Promise<Recommendation | null> {
    try {
      const response = await axios.post(`${this.API_URL}/recommendations/generate`, {}, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (response.data) {
        if (response.data.timestamp) {
          response.data.timestamp = new Date(response.data.timestamp);
        }
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      handleAuthError(error);
      throw error;
    }
  }
}
