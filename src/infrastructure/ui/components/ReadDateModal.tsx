import React, { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@mui/material/Button';
import { Book } from '../../../domain/entities/Book';
import { BooksContext } from '../context/BooksContext';

interface ReadDateModalProps {
  book: Book;
  onClose: () => void;
  onBookUpdated?: (updatedBookId: string) => void;
}

/**
 * Component for editing the reading dates of a book
 */
const ReadDateModal: React.FC<ReadDateModalProps> = ({ book, onClose, onBookUpdated }) => {
  // Initialize state with current book dates
  const [startDate, setStartDate] = useState<Date | null>(
    book.startDate ? new Date(book.startDate) : null
  );
  const [readDate, setReadDate] = useState<Date | null>(
    book.readDate ? new Date(book.readDate) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { updateBook } = useContext(BooksContext);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Prepare the update data
      const updateData: Partial<Book> = {};
      
      // Only include dates if they've changed
      if (startDate !== (book.startDate ? new Date(book.startDate) : null)) {
        // Convert null to undefined for the Book type
        updateData.startDate = startDate === null ? undefined : startDate;
      }
      
      if (readDate !== (book.readDate ? new Date(book.readDate) : null)) {
        // Convert null to undefined for the Book type
        updateData.readDate = readDate === null ? undefined : readDate;
      }
      
      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        console.log('Updating book dates:', updateData);
        try {
          // La función updateBook devuelve Promise<void>
          await updateBook(book.id, updateData);
          
          // Notificar al componente padre con el ID actual del libro
          if (onBookUpdated) {
            console.log('Libro actualizado con ID:', book.id);
            onBookUpdated(book.id);
          }
        } catch (error) {
          console.error('Error al actualizar fechas del libro:', error);
          throw error; // Re-lanzar el error para que sea capturado por el bloque catch externo
        }
      }
      
      onClose();
    } catch (err: any) {
      console.error('Error updating book dates:', err);
      setError(err.message || 'Error al actualizar las fechas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300" 
      style={{ backgroundColor: 'rgba(20, 30, 40, 0.75)', backdropFilter: 'blur(3px)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all duration-300 scale-100 border-l-4 border-teal-600">
        <div className="flex items-center mb-4">
          <div className="bg-teal-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Edit Reading Dates</h2>
        </div>
        <p className="text-sm text-gray-600 mb-5 pl-2 border-l-2 border-teal-200">"{book.title}" by {book.author}</p>
        
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
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadDateModal;
