import React, { useContext, useState } from 'react';
import { BooksContext } from '../context/BooksContext';
import BookItem from './BookItem';
import { Book } from '../../../domain/entities/Book';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';

/**
 * Component that displays the list of books that have been read
 */
const ReadBooks: React.FC = () => {
  const { readBooks } = useContext(BooksContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent'); // 'recent', 'title', 'author', 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'compact'

  // Filter books based on search term
  const filteredBooks = readBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort books based on selected option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'recent':
      default:
        return new Date(b.readDate || 0).getTime() - new Date(a.readDate || 0).getTime();
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-teal-800">My Reading Journey</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" fontSize="small" />
            </div>
            <input
              type="text"
              placeholder="Search books..."
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
            <button 
              className={`p-2 ${viewMode === 'compact' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('compact')}
              title="Compact View"
            >
              <ViewHeadlineIcon fontSize="small" />
            </button>
          </div>
          
          {/* Sort dropdown */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <SortIcon className="text-gray-400 mr-2" fontSize="small" />
              <select
                className="bg-transparent appearance-none outline-none pr-8 text-gray-700"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recent">Recently Read</option>
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="bg-pink-50 p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Books Read</p>
            <p className="text-2xl font-bold text-teal-700">{readBooks.length}</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Avg Rating</p>
            <p className="text-2xl font-bold text-teal-700">
              {readBooks.length > 0 
                ? (readBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / readBooks.length).toFixed(1)
                : '0.0'}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Top Genre</p>
            <p className="text-lg font-bold text-teal-700 truncate">
              {readBooks.length > 0 
                ? Object.entries(readBooks.reduce((genres, book) => {
                    if (book.genre) {
                      genres[book.genre] = (genres[book.genre] || 0) + 1;
                    }
                    return genres;
                  }, {} as Record<string, number>))
                  .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
                : 'None'}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Latest Read</p>
            <p className="text-lg font-bold text-teal-700 truncate">
              {readBooks.length > 0 
                ? [...readBooks].sort((a, b) => 
                    new Date(b.readDate || 0).getTime() - new Date(a.readDate || 0).getTime()
                  )[0]?.title || 'None'
                : 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Book list */}
      {sortedBooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          {searchTerm ? (
            <p className="text-gray-600">No books match your search criteria.</p>
          ) : (
            <p className="text-gray-600">You haven't read any books yet.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <p className="text-sm text-gray-500 mb-4">{sortedBooks.length} {sortedBooks.length === 1 ? 'book' : 'books'} found</p>
          
          {viewMode === 'grid' && (
            <ul className="list-none grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedBooks.map((book) => (
                <BookItem key={book.id} {...book} viewMode={viewMode} />
              ))}
            </ul>
          )}
          
          {viewMode === 'list' && (
            <ul className="list-none flex flex-col gap-3">
              {sortedBooks.map((book) => (
                <BookItem key={book.id} {...book} viewMode={viewMode} />
              ))}
            </ul>
          )}
          
          {viewMode === 'compact' && (
            <ul className="list-none flex flex-col divide-y divide-gray-100">
              {sortedBooks.map((book) => (
                <BookItem key={book.id} {...book} viewMode={viewMode} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadBooks;
