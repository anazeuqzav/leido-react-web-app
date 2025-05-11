import { UserStatistics } from '../../domain/entities/Statistics';
import { StatisticsUseCases } from '../../domain/useCases/StatisticsUseCases';

/**
 * Servicio de estadísticas que coordina operaciones relacionadas con estadísticas
 */
export class StatisticsService {
  private statisticsUseCases: StatisticsUseCases;

  constructor(statisticsUseCases: StatisticsUseCases) {
    this.statisticsUseCases = statisticsUseCases;
  }

  /**
   * Obtiene las estadísticas del usuario
   * @returns Promesa con las estadísticas del usuario
   */
  async getUserStatistics(): Promise<UserStatistics> {
    return this.statisticsUseCases.getUserStatistics();
  }
}
