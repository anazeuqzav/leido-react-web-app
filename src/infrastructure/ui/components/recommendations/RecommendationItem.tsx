import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, BookDTO } from '../../../../domain/entities/Book';
import { BooksContext } from '../../context/BooksContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import AddBookDetailsModal from '../modals/AddBookDetailsModal';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { RecommendationItemProps } from './types';

/**
 * Component to display a recommendation item
 * @param recommendation - The recommendation to display
 * @param viewMode - The view mode to display the recommendation in (grid or list)
 * @returns The recommendation item component
 */
const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { addBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);
  const [isAddedToWantToRead, setIsAddedToWantToRead] = useState(false);
  const [isAddedToRead, setIsAddedToRead] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [bookToAdd, setBookToAdd] = useState<BookDTO | null>(null);

  // Create a book from the recommendation
  const createBookFromRecommendation = (status: 'read' | 'to-read') => {
    if (!user) {
      console.error('No authenticated user');
      return;
    }

    // Verificar que haya un token de autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    // Crear un objeto que cumpla con BookDTO
    const newBook: BookDTO = {
      title: recommendation.title,
      author: recommendation.author,
      year: recommendation.year || undefined,
      genre: recommendation.genre || undefined,
      status: status,
      rating: status === 'read' ? 1 : undefined,
      cover: recommendation.cover || undefined,
      externalId: recommendation.externalId || undefined,
      userId: '',
      readDate: status === 'read' ? new Date().toISOString() : undefined,
      startDate: status === 'read' ? new Date().toISOString() : undefined
    };

    console.log('Adding book from recommendation:', newBook);
    addBook(newBook)
      .then(() => {
        if (status === 'read') {
          toast.success(`"${recommendation.title}" has been added to your read books!`);
        } else {
          toast.success(`"${recommendation.title}" has been added to your want to read list!`);
        }
      })
      .catch(error => {
        console.error('Error adding book from recommendation:', error);
        toast.error('Failed to add book to your library. Please try again.');
      });
  };

  const handleAddToRead = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      console.error('No authenticated user');
      return;
    }

    // Create a book from the recommendation
    const newBook: BookDTO = {
      title: recommendation.title,
      author: recommendation.author,
      year: recommendation.year || undefined,
      genre: recommendation.genre || undefined,
      status: 'read',
      rating: 1,
      cover: recommendation.cover || undefined,
      externalId: recommendation.externalId || undefined,
      userId: '',
      readDate: new Date().toISOString(),
      startDate: new Date().toISOString()
    };

    // Save the book and show the modal
    setBookToAdd(newBook);
    setShowDateModal(true);
  };

  // Function to handle modal confirmation
  const handleDateModalConfirm = (startDate: Date | null, readDate: Date | null, rating: number | null) => {
    if (!bookToAdd) return;

    // Update the dates and rating with the modal values
    const updatedBook: BookDTO = {
      ...bookToAdd,
      startDate: startDate ? startDate.toISOString() : undefined,
      readDate: readDate ? readDate.toISOString() : undefined,
      rating: rating || undefined
    };

    addBook(updatedBook)
      .then(() => {
        toast.success(`"${recommendation.title}" has been added to your read books!`);
        setIsAddedToRead(true);
      })
      .catch(error => {
        console.error('Error adding book from recommendation:', error);
        toast.error('Failed to add book to your library. Please try again.');
      });

    // Close the modal
    setShowDateModal(false);
  };

  const handleAddToWantToRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    createBookFromRecommendation('to-read');
    // Mark the book as added to disable the button
    setIsAddedToWantToRead(true);
  };

  const handleClick = () => {
    // If we have an externalId, navigate to the book details page
    if (recommendation.externalId) {
      // Navigate to the book details page using the /book/ route for OpenLibrary books
      navigate(`/book/${recommendation.externalId}`);
    }
  };

  // Render grid view (card layout)
  const renderGridView = () => (
    <div className="h-full">
      {recommendation.reason && (
        <div className="border-l-4 border-teal-600 pl-3 mb-2 bg-pink-50 py-2 rounded-r">
          <p className="text-sm text-teal-800 font-medium">{recommendation.reason}</p>
        </div>
      )}
      <div
        className="relative flex flex-col border-l-4 border-teal-600 p-4 rounded-lg bg-white shadow-md w-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] hover:border-l-8"
        onClick={handleClick}
      >
        <div className="flex items-start">
          {/* Book cover */}
          <div className="mr-4">
            {recommendation.cover ? (
              <img
                src={recommendation.cover}
                alt={`Cover of ${recommendation.title}`}
                className="w-28 h-40 object-cover rounded border border-gray-200"
                onError={(e) => {
                  // If the image fails, show a book icon
                  (e.target as HTMLImageElement).style.display = 'none';
                  e.currentTarget.parentElement!.classList.add('book-icon-fallback');
                  const iconDiv = document.createElement('div');
                  iconDiv.className = "w-28 h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-gray-200";
                  iconDiv.innerHTML = '<svg class="MuiSvgIcon-root" style="font-size: 60px" focusable="false" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></svg>';
                  e.currentTarget.parentElement!.appendChild(iconDiv);
                }}
              />
            ) : (
              <div className="w-28 h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-gray-200">
                <BookIcon style={{ fontSize: 60 }} />
              </div>
            )}
          </div>

          {/* Book information */}
          <div className="flex-1 flex flex-col gap-1 text-left">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{recommendation.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{recommendation.author} {recommendation.year && `(${recommendation.year})`}</p>
            {recommendation.genre && <p className="text-xs text-teal-800 bg-pink-50 inline-block px-2 py-1 rounded-full border border-pink-100 font-medium">{recommendation.genre}</p>}

            {/* Buttons to add to lists */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                className={`text-white text-xs font-medium ${isAddedToRead ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} px-3 py-1.5 rounded-full transition-colors flex items-center`}
                onClick={handleAddToRead}
                disabled={isAddedToRead}
              >
                <AutoStoriesIcon className="mr-1" style={{ fontSize: 16 }} />
                {isAddedToRead ? 'Added to read' : 'Mark as read'}
              </button>

              <button
                className={`text-teal-800 text-xs font-medium border border-pink-200 ${isAddedToWantToRead ? 'bg-gray-100 cursor-not-allowed' : 'bg-pink-50 hover:bg-pink-100'} px-3 py-1.5 rounded-full transition-colors flex items-center`}
                onClick={handleAddToWantToRead}
                disabled={isAddedToWantToRead}
              >
                <BookmarkAddIcon className="mr-1" style={{ fontSize: 16 }} />
                {isAddedToWantToRead ? 'Added to list' : 'Want to read'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render list view (horizontal layout)
  const renderListView = () => (
    <div
      className="relative flex items-center border-l-4 border-teal-600 p-3 rounded-lg bg-white shadow-sm w-full cursor-pointer transition-all duration-300 hover:shadow-md hover:border-l-8"
      onClick={handleClick}
    >
      {/* Book cover */}
      {recommendation.cover ? (
        <div className="flex-shrink-0 w-16 h-20 mr-4 overflow-hidden rounded">
          <img
            src={recommendation.cover}
            alt={`Cover of ${recommendation.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 w-16 h-20 mr-4 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-gray-200">
          <BookIcon style={{ fontSize: 32 }} />
        </div>
      )}

      {/* Book information */}
      <div className="flex-1 flex flex-col gap-1 text-left min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800 truncate">{recommendation.title}</h3>
        </div>

        <div className="flex items-center text-sm text-gray-600 font-medium">
          <span className="truncate">{recommendation.author}</span>
          {recommendation.year && <span className="ml-1">({recommendation.year})</span>}
          {recommendation.genre && <span className="ml-2 text-xs text-teal-800 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100 font-medium">{recommendation.genre}</span>}
        </div>

        <div className="flex items-center mt-1 gap-2">
          <button
            className={`text-white text-xs font-medium ${isAddedToRead ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} px-2 py-0.5 rounded-full transition-colors flex items-center`}
            onClick={handleAddToRead}
            disabled={isAddedToRead}
          >
            <AutoStoriesIcon className="mr-1" style={{ fontSize: 14 }} />
            {isAddedToRead ? 'Added to read' : 'Mark as read'}
          </button>

          <button
            className={`text-teal-800 text-xs font-medium border border-pink-200 ${isAddedToWantToRead ? 'bg-gray-100 cursor-not-allowed' : 'bg-pink-50 hover:bg-pink-100'} px-2 py-0.5 rounded-full transition-colors flex items-center`}
            onClick={handleAddToWantToRead}
            disabled={isAddedToWantToRead}
          >
            <BookmarkAddIcon className="mr-1" style={{ fontSize: 14 }} />
            {isAddedToWantToRead ? 'Added to list' : 'Want to read'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Modal for selecting dates */}
      {showDateModal && (
        <AddBookDetailsModal
          isOpen={showDateModal}
          onClose={() => setShowDateModal(false)}
          onConfirm={handleDateModalConfirm}
          initialStartDate={bookToAdd?.startDate ? new Date(bookToAdd.startDate) : new Date()}
          initialReadDate={bookToAdd?.readDate ? new Date(bookToAdd.readDate) : new Date()}
          initialRating={bookToAdd?.rating || 0}
        />
      )}
    </>
  );
};

export default RecommendationItem;
