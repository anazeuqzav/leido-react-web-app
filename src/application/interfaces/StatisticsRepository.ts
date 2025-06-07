import { UserStatistics } from '../../domain/entities/Statistics';

/**
 * Interfaz para el repositorio de estadísticas
 * Define métodos para interactuar con la fuente de datos de estadísticas
 */
export interface StatisticsRepository {
  getUserStatistics(): Promise<UserStatistics>;
}
