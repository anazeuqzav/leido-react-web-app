import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserStatistics } from '../../../domain/entities/Statistics';
import { StatisticsRepositoryImpl } from '../../repositories/StatisticsRepositoryImpl';
import { subscribe, unsubscribe } from '../../utils/eventBus';

const statisticsRepository = new StatisticsRepositoryImpl();

// Define the context type
interface StatisticsContextType {
  statistics: UserStatistics | null;
  isLoading: boolean;
  error: string | null;
  refreshStatistics: () => Promise<void>;
}

// Create the context with a default value
export const StatisticsContext = createContext<StatisticsContextType>({
  statistics: null,
  isLoading: false,
  error: null,
  refreshStatistics: async () => { },
});

// Define the provider props
interface StatisticsProviderProps {
  children: ReactNode;
}

/** StatisticsProvider component */
export const StatisticsProvider: React.FC<StatisticsProviderProps> = ({ children }) => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches user statistics
   */
  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await statisticsRepository.getUserStatistics();
      setStatistics(stats);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load statistics on component mount
  useEffect(() => {
    fetchStatistics();
    
    // Subscribe to BOOKS_UPDATED event
    const handleBooksUpdated = () => {
      console.log('Statistics: Received BOOKS_UPDATED event, refreshing statistics...');
      fetchStatistics();
    };
    
    subscribe('BOOKS_UPDATED', handleBooksUpdated);
    
    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe('BOOKS_UPDATED', handleBooksUpdated);
    };
  }, [fetchStatistics]);

  /**
   * Refreshes the statistics data
   */
  const refreshStatistics = useCallback(async () => {
    await fetchStatistics();
  }, [fetchStatistics]);

  return (
    <StatisticsContext.Provider
      value={{
        statistics,
        isLoading,
        error,
        refreshStatistics,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};

/**
 * Hook to use the statistics context
 * @returns Statistics context
 */
export const useStatistics = (): StatisticsContextType => {
  const context = React.useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};
