import React from 'react';

import MonthlyReadChart from './MonthlyReadChart';
import TopGenresChart from './TopGenresChart';
import TopAuthorsChart from './TopAuthorsChart';
import RatingDistributionChart from './RatingDistributionChart';
import TopRatedBooks from './TopRatedBooks';

import { useStatistics } from '../../context/StatisticsContext';

const Statistics: React.FC = () => {
  const { statistics, isLoading: loading, error } = useStatistics();

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
        <strong className="font-bold">No data:</strong>
        <span className="block sm:inline"> Not enough books read to generate statistics. Mark some books as read to see your statistics.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Your Reading Statistics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Total Books Read</h2>
          <p className="text-3xl sm:text-4xl font-bold text-teal-600 mt-2">{statistics.totalBooks}</p>
        </div>

        {statistics.bestMonth ? (
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Best Reading Month</h2>
            <p className="text-xl sm:text-2xl font-bold text-teal-600 mt-2">{statistics.bestMonth.month} {statistics.bestMonth.year}</p>
            <p className="text-sm sm:text-base text-gray-600">{statistics.bestMonth.count} books</p>
          </div>
        ) : (
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Best Reading Month</h2>
            <p className="text-gray-500">No data</p>
          </div>
        )}

        {statistics.mostReadGenre ? (
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Most Read Genre</h2>
            <p className="text-xl sm:text-2xl font-bold text-teal-600 mt-2">{statistics.mostReadGenre.genre}</p>
            <p className="text-sm sm:text-base text-gray-600">{statistics.mostReadGenre.count} books</p>
          </div>
        ) : (
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Most Read Genre</h2>
            <p className="text-gray-500">No data</p>
          </div>
        )}
      </div>

      {/* Monthly reads and genres charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Monthly reads chart */}
        <div className="bg-white pt-2 pb-4 px-2 sm:pt-3 sm:pb-1 sm:px-3 rounded-lg shadow-md overflow-x-hidden">
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-teal-700 px-1">Books Read by Month</h2>
          {statistics.monthlyReads.length > 0 ? (
            <div className="-mt-1 -mb-3 w-full overflow-x-hidden">
              <div className="min-w-full">
                <MonthlyReadChart data={statistics.monthlyReads} />
              </div>
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-500 px-1">Not enough data to display the chart.</p>
          )}
        </div>

        {/* Genres chart */}
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-teal-700 px-1">Most Read Genres</h2>
          {statistics.topGenres.length > 0 ? (
            <div className="-mt-1">
              <TopGenresChart data={statistics.topGenres} maxItems={5} showLegend={true} />
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-500 px-1">Not enough data to display the chart.</p>
          )}
        </div>
      </div>

      {/* Ratings and favorite books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Rating distribution */}
        <div className="bg-white pt-2 pb-0 px-2 sm:pt-3 sm:pb-1 sm:px-3 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-teal-700 px-1">Rating Distribution</h2>
          {statistics.ratingDistribution.length > 0 ? (
            <div className="-mt-1 -mb-3">
              <RatingDistributionChart data={statistics.ratingDistribution} showLegend={true} />
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-500 px-1">Not enough data to display the chart.</p>
          )}
        </div>

        {/* Top rated books */}
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-teal-700">Top Rated Books</h2>
          {statistics.topRatedBooks.length > 0 ? (
            <TopRatedBooks books={statistics.topRatedBooks} maxItems={5} />
          ) : (
            <p className="text-sm sm:text-base text-gray-500">Not enough data to display top books.</p>
          )}
        </div>
      </div>

      {/* Top authors section */}
      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-md mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-teal-700 px-1">Most Read Authors</h2>
        {statistics.topAuthors.length > 0 ? (
          <div className="-mt-1">
            <TopAuthorsChart data={statistics.topAuthors} maxItems={5} showLegend={true} />
          </div>
        ) : (
          <p className="text-sm sm:text-base text-gray-500 px-1">Not enough data to display the chart.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
