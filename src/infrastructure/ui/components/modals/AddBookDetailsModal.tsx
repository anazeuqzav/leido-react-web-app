import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { AddBookDetailsModalProps } from './types';

/**
 * Component for selecting reading dates and rating when adding a book as read
 */
const AddBookDetailsModal: React.FC<AddBookDetailsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialStartDate = new Date(),
  initialReadDate = new Date(),
  initialRating = 0
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [readDate, setReadDate] = useState<Date | null>(initialReadDate);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    setIsSubmitting(true);
    onConfirm(startDate, readDate, rating);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300"
      style={{ backgroundColor: 'rgba(20, 30, 40, 0.75)', backdropFilter: 'blur(3px)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all duration-300 scale-100 border-l-4 border-teal-600 bg-gradient-to-br from-white to-pink-50">
        <div className="flex items-center mb-4">
          <div className="bg-teal-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Add Reading Dates</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Start Reading Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              maxDate={readDate || new Date()}
              placeholderText="Select start date"
              isClearable
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Finish Reading Date:</label>
            <DatePicker
              selected={readDate}
              onChange={(date) => setReadDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              maxDate={new Date()}
              minDate={startDate || undefined}
              placeholderText="Select finish date"
              isClearable
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Rating:</label>
            <Rating
              name="book-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              precision={1}
              size="large"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outlined"
            onClick={onClose}
            size="small"
            disabled={isSubmitting}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 shadow-sm"
            size="small"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add to Library'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBookDetailsModal;
