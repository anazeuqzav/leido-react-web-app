import axios from 'axios';
import { UserStatistics } from '../../domain/entities/Statistics';
import { StatisticsRepository } from '../../domain/ports/StatisticsRepository';

/**
 * Implementación del repositorio de estadísticas
 */
export class StatisticsRepositoryImpl implements StatisticsRepository {
  private API_URL = 'http://localhost:5000';

  /**
   * Obtiene los encabezados de autenticación con token
   * @returns Objeto de encabezados con token de autorización
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
  }

  /**
   * Obtiene las estadísticas del usuario
   * @returns Promesa con las estadísticas del usuario
   */
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      const response = await axios.get(`${this.API_URL}/api/statistics`, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
}
