import { UserStatistics } from '../entities/Statistics';
import { StatisticsRepository } from '../ports/StatisticsRepository';

/**
 * Casos de uso de estadísticas que encapsulan la lógica de negocio para operaciones de estadísticas
 */
export class StatisticsUseCases {
  private statisticsRepository: StatisticsRepository;

  constructor(statisticsRepository: StatisticsRepository) {
    this.statisticsRepository = statisticsRepository;
  }

  /**
   * Obtiene las estadísticas del usuario
   * @returns Promesa con las estadísticas del usuario
   */
  async getUserStatistics(): Promise<UserStatistics> {
    return this.statisticsRepository.getUserStatistics();
  }
}
