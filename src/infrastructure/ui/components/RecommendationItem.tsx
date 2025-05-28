import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecommendationItem as RecommendationItemType } from '../../../domain/entities/Recommendation';
import { Book } from '../../../domain/entities/Book';
import { BooksContext } from '../context/BooksContext';
import { AuthContext } from '../context/AuthContext';
import Button from '@mui/material/Button';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

interface RecommendationItemProps {
  recommendation: RecommendationItemType;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation }) => {
  const navigate = useNavigate();
  const { addBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);
  
  // Create a book from the recommendation
  const createBookFromRecommendation = (status: 'read' | 'to-read') => {
    if (!user) {
      console.error('No authenticated user');
      return;
    }

    const newBook: Omit<Book, 'id'> = {
      title: recommendation.title,
      author: recommendation.author,
      year: recommendation.year || undefined,
      genre: recommendation.genre || undefined,
      status: status,
      rating: status === 'read' ? 0 : undefined,
      cover: recommendation.cover || undefined,
      externalId: recommendation.externalId || undefined,
      readDate: status === 'read' ? new Date() : undefined,
      startDate: status === 'read' ? new Date() : undefined,
      userId: user.id
    };
    
    addBook(newBook);
  };
  
  const handleAddToRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    createBookFromRecommendation('read');
  };
  
  const handleAddToWantToRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    createBookFromRecommendation('to-read');
  };
  
  const handleClick = () => {
    if (recommendation.externalId) {
      navigate(`/library-book/${recommendation.externalId}`);
    }
  };

  return (
    <div className="h-full">
      {recommendation.reason && (
        <div className="border-l-4 border-teal-500 pl-3 mb-2 bg-teal-50 py-2 rounded-r">
          <p className="text-sm text-teal-700 font-medium">{recommendation.reason}</p>
        </div>
      )}
      <div 
        className="flex flex-col border border-teal-800 p-4 rounded-lg bg-white shadow-md w-full cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        <div className="flex items-start">
          {/* Book cover */}
          <div className="mr-4">
            {recommendation.cover ? (
              <img
                src={recommendation.cover}
                alt={`Cover of ${recommendation.title}`}
                className="w-28 h-40 object-cover rounded border border-gray-300"
                onError={(e) => {
                  // If the image fails, show a book icon
                  (e.target as HTMLImageElement).style.display = 'none';
                  e.currentTarget.parentElement!.classList.add('book-icon-fallback');
                  const iconDiv = document.createElement('div');
                  iconDiv.className = "w-28 h-40 flex items-center justify-center bg-gray-200 text-gray-500 rounded border border-gray-300";
                  iconDiv.innerHTML = '<svg class="MuiSvgIcon-root" style="font-size: 60px" focusable="false" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></svg>';
                  e.currentTarget.parentElement!.appendChild(iconDiv);
                }}
              />
            ) : (
              <div className="w-28 h-40 flex items-center justify-center bg-gray-200 text-gray-500 rounded border border-gray-300">
                <BookIcon style={{ fontSize: 60 }} />
              </div>
            )}
          </div>
          
          {/* Book information */}
          <div className="flex-1 flex flex-col gap-1 text-left">
            <p className="text-base font-bold text-gray-800">{recommendation.title}</p>
            <p className="text-sm text-gray-600">{recommendation.author} {recommendation.year && `(${recommendation.year})`}</p>
            {recommendation.genre && <p className="text-sm text-gray-600">{recommendation.genre}</p>}
            
            {/* Buttons to add to lists */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="contained"
                size="small"
                onClick={handleAddToRead}
                className="bg-teal-600 text-white hover:bg-teal-700"
              >
                Mark as read
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddToWantToRead}
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Want to read
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationItem;
