import React, { useEffect, useState } from 'react';
import { UserStatistics } from '../../../domain/entities/Statistics';
import { StatisticsService } from '../../../application/services/StatisticsService';
import { StatisticsUseCases } from '../../../domain/useCases/StatisticsUseCases';
import { StatisticsRepositoryImpl } from '../../adapters/StatisticsRepositoryImpl';
import MonthlyReadChart from './statistics/MonthlyReadChart';
import TopGenresChart from './statistics/TopGenresChart';
import TopAuthorsChart from './statistics/TopAuthorsChart';
import RatingDistributionChart from './statistics/RatingDistributionChart';
import TopRatedBooks from './statistics/TopRatedBooks';

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

  if (!statistics || statistics.totalBooks === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Sin datos:</strong>
        <span className="block sm:inline"> No hay suficientes libros leídos para generar estadísticas. Marca algunos libros como leídos para ver tus estadísticas.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tus Estadísticas de Lectura</h1>
      
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-700">Total de Libros Leídos</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{statistics.totalBooks}</p>
        </div>
        
        {statistics.bestMonth ? (
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Mejor Mes de Lectura</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">{statistics.bestMonth.month} {statistics.bestMonth.year}</p>
            <p className="text-gray-600">{statistics.bestMonth.count} libros</p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Mejor Mes de Lectura</h2>
            <p className="text-gray-500">Sin datos</p>
          </div>
        )}
        
        {statistics.mostReadGenre ? (
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Género Más Leído</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">{statistics.mostReadGenre.genre}</p>
            <p className="text-gray-600">{statistics.mostReadGenre.count} libros</p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Género Más Leído</h2>
            <p className="text-gray-500">Sin datos</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
      </div>
      
      {/* Distribución de valoraciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribución de Valoraciones</h2>
          {statistics.ratingDistribution.length > 0 ? (
            <RatingDistributionChart data={statistics.ratingDistribution} />
          ) : (
            <p className="text-gray-500">No hay valoraciones suficientes para mostrar el gráfico.</p>
          )}
        </div>
        
        {/* Top libros mejor valorados */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tus Libros Favoritos</h2>
          {statistics.topRatedBooks.length > 0 ? (
            <TopRatedBooks books={statistics.topRatedBooks} />
          ) : (
            <p className="text-gray-500">No hay valoraciones suficientes para mostrar tus favoritos.</p>
          )}
        </div>
      </div>

      {/* Gráfico de autores más leídos */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Top 5 Autores Más Leídos</h2>
        {statistics.topFiveAuthors.length > 0 ? (
          <TopAuthorsChart data={statistics.topFiveAuthors} />
        ) : (
          <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
