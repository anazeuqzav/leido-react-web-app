import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Recommendation } from '../../../domain/entities/Recommendation';
import { RecommendationRepositoryImpl } from '../../repositories/RecommendationRepositoryImpl';

const recommendationRepository = new RecommendationRepositoryImpl();

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

export const RecommendationContext = createContext<RecommendationContextType>({
  recommendation: null,
  isLoading: false,
  error: null,
  refreshing: false,
  fetchRecommendations: async () => {},
  generateRecommendations: async () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  viewMode: 'grid',
  setViewMode: () => {},
});

interface RecommendationProviderProps {
  children: ReactNode;
}

export const RecommendationProvider: React.FC<RecommendationProviderProps> = ({ children }) => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Load recommendations on component mount
  React.useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <RecommendationContext.Provider
      value={{
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
      }}
    >
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
