import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Recommendation } from '../../../domain/entities/Recommendation';
import { RecommendationRepositoryImpl } from '../../repositories/RecommendationRepositoryImpl';

// Initialize the recommendation repository
const recommendationRepository = new RecommendationRepositoryImpl();

/**
 * Interface defining the shape of the recommendation context
 * Contains recommendation data and methods to interact with it
 */
interface RecommendationContextType {
  recommendation: Recommendation | null;
  isLoading: boolean;
  error: string | null;
  refreshing: boolean;
  fetchRecommendations: () => Promise<void>;
  generateRecommendations: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

// Create the context with default values
export const RecommendationContext = createContext<RecommendationContextType>({
  recommendation: null,
  isLoading: false,
  error: null,
  refreshing: false,
  fetchRecommendations: async () => { },
  generateRecommendations: async () => { },
  searchTerm: '',
  setSearchTerm: () => { },
  viewMode: 'grid',
  setViewMode: () => { },
});

interface RecommendationProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application and provides recommendation data
 * and methods to child components through the context
 */
export const RecommendationProvider: React.FC<RecommendationProviderProps> = ({ children }) => {
  // State for storing recommendation data
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // UI related states
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /**
   * Fetches recommendations from the repository
   * Handles loading states and error scenarios
   */
  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await recommendationRepository.getRecommendations();
      setRecommendation(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      let errorMessage = 'Could not load recommendations. Please try again later.';

      if (err.response) {
        errorMessage += ` Server Error: ${err.response.status} - ${err.response.statusText}`;
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        errorMessage += ' Could not connect to the server. Please check your internet connection.';
      } else {
        errorMessage += ` Error: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generates new recommendations
   * Typically called when user requests a refresh
   */
  const generateRecommendations = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await recommendationRepository.generateRecommendations();
      setRecommendation(data);
      setError(null);
    } catch (err: any) {
      console.error('Error generating recommendations:', err);
      setError('Could not generate recommendations. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Load recommendations when the component mounts
  React.useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Provide the context value to child components
  const contextValue = {
    recommendation,
    isLoading,
    error,
    refreshing,
    fetchRecommendations,
    generateRecommendations,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
  };

  return (
    <RecommendationContext.Provider value={contextValue}>
      {children}
    </RecommendationContext.Provider>
  );
};

/**
 * Hook to use the recommendation context
 * @returns Recommendation context
 */
export const useRecommendation = (): RecommendationContextType => {
  const context = React.useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendation must be used within a RecommendationProvider');
  }
  return context;
};
