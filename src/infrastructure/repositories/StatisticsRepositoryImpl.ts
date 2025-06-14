import axios from 'axios';
import config from '../../config/api';
import { UserStatistics } from '../../domain/entities/Statistics';
import { getAuthHeaders, handleAuthError } from '../utils/authUtils';
import { StatisticsRepository } from '../../application/interfaces/StatisticsRepository';

/**
 * Statistics repository implementation
 */
export class StatisticsRepositoryImpl implements StatisticsRepository {
  private API_URL = config.API_URL;

  /**
   * Gets user statistics
   * @returns Promise with user statistics
   */
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      const response = await axios.get(`${this.API_URL}/statistics`, {
        headers: getAuthHeaders()
      });
      return response.data as UserStatistics;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      handleAuthError(error);
      throw error;
    }
  }
}
