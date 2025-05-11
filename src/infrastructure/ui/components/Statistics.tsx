import React, { useEffect, useState } from 'react';
import { UserStatistics } from '../../../domain/entities/Statistics';
import { StatisticsService } from '../../../application/services/StatisticsService';
import { StatisticsUseCases } from '../../../domain/useCases/StatisticsUseCases';
import { StatisticsRepositoryImpl } from '../../adapters/StatisticsRepositoryImpl';
import MonthlyReadChart from './statistics/MonthlyReadChart';
import TopGenresChart from './statistics/TopGenresChart';
import TopAuthorsChart from './statistics/TopAuthorsChart';

// Inicializar servicios y casos de uso
const statisticsRepository = new StatisticsRepositoryImpl();
const statisticsUseCases = new StatisticsUseCases(statisticsRepository);
const statisticsService = new StatisticsService(statisticsUseCases);

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getUserStatistics();
        // Añadir mensaje de depuración
        console.log('Datos de estadísticas recibidos:', data);
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('No se pudieron cargar las estadísticas. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Añadir depuración para ver el estado actual de las estadísticas
  if (statistics) {
    console.log('Estado de las estadísticas:', {
      monthlyReads: statistics.monthlyReads.length,
      topGenres: statistics.topGenres.length,
      topAuthors: statistics.topAuthors.length
    });
  }

  if (!statistics || 
      (statistics.monthlyReads.length === 0 && 
       statistics.topGenres.length === 0 && 
       statistics.topAuthors.length === 0)) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Sin datos:</strong>
        <span className="block sm:inline"> No hay suficientes libros leídos para generar estadísticas. Marca algunos libros como leídos para ver tus estadísticas.</span>
        {statistics && (
          <div className="mt-2 text-xs">
            <p>Información de depuración:</p>
            <pre className="bg-gray-100 p-2 mt-1 rounded">
              {JSON.stringify(statistics, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tus Estadísticas de Lectura</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de lecturas mensuales */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Libros Leídos por Mes</h2>
          {statistics.monthlyReads.length > 0 ? (
            <MonthlyReadChart data={statistics.monthlyReads} />
          ) : (
            <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico.</p>
          )}
        </div>

        {/* Gráfico de géneros más leídos */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Géneros Más Leídos</h2>
          {statistics.topGenres.length > 0 ? (
            <TopGenresChart data={statistics.topGenres} />
          ) : (
            <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico.</p>
          )}
        </div>

        {/* Gráfico de autores más leídos */}
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Autores Más Leídos</h2>
          {statistics.topAuthors.length > 0 ? (
            <TopAuthorsChart data={statistics.topAuthors} />
          ) : (
            <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
