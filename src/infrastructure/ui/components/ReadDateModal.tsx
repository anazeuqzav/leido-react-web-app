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
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300" style={{ backgroundColor: 'rgba(70, 85, 100, 0.15)', backdropFilter: 'blur(1px)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all duration-300 scale-100 border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Editar fechas de lectura</h2>
        <p className="text-sm text-gray-600 mb-4">"{book.title}" por {book.author}</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Fecha de inicio de lectura:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded px-2 py-1 w-full"
              maxDate={readDate || new Date()}
              placeholderText="Selecciona fecha de inicio"
              isClearable
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-600 block mb-1">Fecha de finalización:</label>
            <DatePicker
              selected={readDate}
              onChange={(date) => setReadDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded px-2 py-1 w-full"
              maxDate={new Date()}
              minDate={startDate || undefined}
              placeholderText="Selecciona fecha de finalización"
              isClearable
            />
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outlined"
            onClick={onClose}
            size="small"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700"
            size="small"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadDateModal;
