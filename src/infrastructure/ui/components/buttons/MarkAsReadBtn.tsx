import React, { useState, useContext } from 'react';
import { BooksContext } from '../../context/BooksContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BookDTO } from '../../../../domain/entities/Book';
import Rating from '@mui/material/Rating';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MarkAsReadBtnProps } from './types';

/**
 * Component for marking a book as read with rating and date
 */
const MarkAsReadBtn: React.FC<MarkAsReadBtnProps> = ({ book, authorNames, coverUrl, onSuccess }) => {
  const { addBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [readDate, setReadDate] = useState(new Date()); // default to today
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddToRead = async () => {
    if (!book || !user) return;

    try {
      // Get the OLID from the book key
      const olid = book.key.split('/').pop() || '';

      const newBook: BookDTO = {
        title: book.title,
        author: authorNames.join(', '),
        year: book.first_publish_date ? parseInt(book.first_publish_date.substring(0, 4)) : undefined,
        genre: book.subjects ? book.subjects[0] : undefined,
        status: 'read',
        rating: rating,
        cover: coverUrl || undefined,
        userId: user.id,
        readDate,
        startDate: startDate || readDate, // if no start date, use the read date
        externalId: olid,
      };

      await addBook(newBook);

      // Show toast notification
      toast.success(`"${book.title}" has been marked as read!`);

      setSuccessMessage("Book added successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error adding book to library:', err);
      toast.error('Error adding book to library. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-3">
        <div>
          <p className="text-sm text-gray-700 font-medium mb-1">Your Rating:</p>
          <Rating
            name="book-rating"
            value={rating}
            precision={0.5}
            onChange={(event, newValue) => setRating(newValue || 0)}
            size="medium"
            className="ml-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 hover:border-teal-500 rounded px-2 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              maxDate={readDate || new Date()}
              placeholderText="Select start date"
              isClearable
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">Finish Date:</label>
            <DatePicker
              selected={readDate}
              onChange={(date) => setReadDate(date || new Date())}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 hover:border-teal-500 rounded px-2 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              maxDate={new Date()}
              minDate={startDate || undefined}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={handleAddToRead}
            className="text-white text-sm font-medium bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-full transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save & Add to Read
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg z-10">
          <div className="text-teal-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAsReadBtn;
