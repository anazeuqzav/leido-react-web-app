import React, { useEffect, useState } from 'react';
import { Recommendation } from '../../../domain/entities/Recommendation';
import { RecommendationService } from '../../../application/services/RecommendationService';
import { RecommendationUseCases } from '../../../domain/useCases/RecommendationUseCases';
import { RecommendationRepositoryImpl } from '../../adapters/RecommendationRepositoryImpl';
import RecommendationItem from './RecommendationItem';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

// Initialize services and use cases
const recommendationRepository = new RecommendationRepositoryImpl();
const recommendationUseCases = new RecommendationUseCases(recommendationRepository);
const recommendationService = new RecommendationService(recommendationUseCases);

const Recommendations: React.FC = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      <div className="container mx-auto px-4 py-6">
        <div className="bg-pink-50 p-4 rounded-lg shadow-sm mb-6">
          <div className="text-center p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Recommendations Available</h3>
            <p className="text-gray-600 mb-6">We don't have recommendations for you at this time. To get recommendations, read and rate some books.</p>
            <button
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center mx-auto"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshIcon className="mr-2" fontSize="small" />
              {refreshing ? 'Generating...' : 'Generate Recommendations'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter recommendations based on search term
  const filteredRecommendations = recommendation ? recommendation.recommendations.filter(rec => 
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rec.genre && rec.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // Group recommendations by source book/author
  const groupedRecommendations = filteredRecommendations.reduce((acc, rec) => {
    // Extract the book title or author from the reason
    let sourceKey = '';
    
    if (rec.reason.includes('"')) {
      // If there are quotes, extract the book title
      const match = rec.reason.match(/"([^"]+)"/); 
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
  }, {} as Record<string, typeof filteredRecommendations>);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-teal-800">Book Recommendations</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" fontSize="small" />
            </div>
            <input
              type="text"
              placeholder="Search recommendations..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* View mode toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button 
              className={`p-2 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <GridViewIcon fontSize="small" />
            </button>
            <button 
              className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <ViewListIcon fontSize="small" />
            </button>
          </div>
          
          {/* Refresh button */}
          <button
            className="flex items-center justify-center gap-1 border border-teal-600 text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshIcon fontSize="small" />
            {refreshing ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      {recommendation.timestamp && (
        <div className="bg-pink-50 p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Recommendations</p>
              <p className="text-xl font-bold text-teal-700">{filteredRecommendations.length}</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-xl font-bold text-teal-700">
                {new Date(recommendation.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {Object.keys(groupedRecommendations).length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No recommendations match your search criteria.</p>
        </div>
      ) : (
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
                <h2 className="text-xl font-semibold text-teal-800 mb-4 border-b border-pink-100 pb-2">
                  {title}
                </h2>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec, recIndex) => (
                      <div key={recIndex} className="flex flex-col h-full">
                        <RecommendationItem recommendation={{...rec, reason: ''}} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {recommendations.map((rec, recIndex) => (
                      <div key={recIndex}>
                        <RecommendationItem recommendation={{...rec, reason: ''}} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
