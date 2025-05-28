import React, { useEffect, useState } from 'react';
import { Recommendation } from '../../../domain/entities/Recommendation';
import { RecommendationService } from '../../../application/services/RecommendationService';
import { RecommendationUseCases } from '../../../domain/useCases/RecommendationUseCases';
import { RecommendationRepositoryImpl } from '../../adapters/RecommendationRepositoryImpl';
import RecommendationItem from './RecommendationItem';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

// Initialize services and use cases
const recommendationRepository = new RecommendationRepositoryImpl();
const recommendationUseCases = new RecommendationUseCases(recommendationRepository);
const recommendationService = new RecommendationService(recommendationUseCases);

const Recommendations: React.FC = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendations();
      setRecommendation(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      let errorMessage = 'Could not load recommendations. Please try again later.';
      
      // Mostrar información más detallada sobre el error
      if (err.response) {
        // Error de respuesta del servidor
        errorMessage += ` Error del servidor: ${err.response.status} - ${err.response.statusText}`;
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        // Error de conexión
        errorMessage += ' No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
      } else {
        // Otro tipo de error
        errorMessage += ` Detalle: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await recommendationService.generateRecommendations();
      setRecommendation(data);
      setError(null);
    } catch (err: any) {
      console.error('Error generating recommendations:', err);
      let errorMessage = 'Could not generate new recommendations. Please try again later.';
      
      // Mostrar información más detallada sobre el error
      if (err.response) {
        // Error de respuesta del servidor
        errorMessage += ` Error del servidor: ${err.response.status} - ${err.response.statusText}`;
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        // Error de conexión
        errorMessage += ' No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
      } else {
        // Otro tipo de error
        errorMessage += ` Detalle: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  };

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

  if (!recommendation || recommendation.recommendations.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">No recommendations:</strong>
        <span className="block sm:inline"> We don't have recommendations for you at this time. To get recommendations, read and rate some books.</span>
        <div className="mt-4">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRefresh}
            disabled={refreshing}
            startIcon={<RefreshIcon />}
          >
            {refreshing ? 'Generating...' : 'Try to generate recommendations'}
          </Button>
        </div>
      </div>
    );
  }

  // Group recommendations by source book/author
  const groupedRecommendations = recommendation.recommendations.reduce((acc, rec) => {
    // Extract the book title or author from the reason
    // Example: "Because you liked \"To Kill a Mockingbird\" by Harper Lee" -> "To Kill a Mockingbird by Harper Lee"
    let sourceKey = '';
    
    if (rec.reason.includes('\"')) {
      // If there are quotes, extract the book title
      const match = rec.reason.match(/\"([^\"]+)\"/); 
      if (match && match[1]) {
        const bookTitle = match[1];
        // Look for a "by Author" after the title
        const authorMatch = rec.reason.match(/by ([^"]+)(?:\.|$)/);
        const author = authorMatch ? authorMatch[1].trim() : '';
        sourceKey = author ? `${bookTitle} by ${author}` : bookTitle;
      } else {
        sourceKey = rec.reason; // Fallback
      }
    } else if (rec.reason.includes('genre')) {
      // If it's by genre, extract the genre
      const genreMatch = rec.reason.match(/genre ([^\s]+)/);
      sourceKey = genreMatch ? `Genre: ${genreMatch[1]}` : 'Similar genre';
    } else {
      sourceKey = rec.reason; // Fallback
    }
    
    if (!acc[sourceKey]) {
      acc[sourceKey] = [];
    }
    acc[sourceKey].push(rec);
    return acc;
  }, {} as Record<string, typeof recommendation.recommendations>);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recommendations for you</h1>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleRefresh}
          disabled={refreshing}
          startIcon={<RefreshIcon />}
        >
          {refreshing ? 'Updating...' : 'Update recommendations'}
        </Button>
      </div>

      {recommendation.timestamp && (
        <p className="text-sm text-gray-500 mb-4">
          Last update: {new Date(recommendation.timestamp).toLocaleDateString()} 
          {' '}
          {new Date(recommendation.timestamp).toLocaleTimeString()}
        </p>
      )}

      <div className="grid grid-cols-1 gap-8">
        {Object.entries(groupedRecommendations).map(([sourceKey, recommendations], index) => {
          // Determine the type of recommendation to display an appropriate title
          let title = sourceKey;
          
          // If the sourceKey starts with "Genre:", format the title
          if (sourceKey.startsWith('Genre:')) {
            title = `Recommendations by ${sourceKey.toLowerCase()}`;
          } else {
            title = `Because you liked ${sourceKey}`;
          }
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
                {title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, recIndex) => (
                  <div key={recIndex} className="flex flex-col h-full">
                    <RecommendationItem recommendation={{...rec, reason: ''}} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
