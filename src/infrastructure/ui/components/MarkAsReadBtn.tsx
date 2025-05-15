import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BooksContext } from '../context/BooksContext';
import { AuthContext } from '../context/AuthContext';
import { BookDetails } from '../../../domain/entities/SearchBook';
import { BookDTO } from '../../../domain/entities/Book';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MarkAsReadBtnProps {
  book: BookDetails;
  authorNames: string[];
  coverUrl: string;
  onSuccess: () => void;
}

/**
 * Component for marking a book as read with rating and date
 */
const MarkAsReadBtn: React.FC<MarkAsReadBtnProps> = ({ book, authorNames, coverUrl, onSuccess }) => {
  const { addBook } = useContext(BooksContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [readDate, setReadDate] = useState(new Date()); // default to today
  const [startDate, setStartDate] = useState<Date | null>(null); // fecha de inicio de lectura
  const [isRating, setIsRating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddToRead = async () => {
    if (!book || !user) return;
    
    try {
      // Extraer el OLID (Open Library ID) de la clave del libro
      // La clave suele tener el formato '/works/OL123456W'
      const olid = book.key.split('/').pop() || '';
      
      const newBook: BookDTO = {
        title: book.title,
        author: authorNames.join(', '),
        year: book.first_publish_date ? parseInt(book.first_publish_date.substring(0, 4)) : undefined,
        genre: book.subjects ? book.subjects[0] : undefined,
        status: 'read',
        rating,
        cover: coverUrl,
        userId: user.id,
        readDate,
        startDate: startDate || readDate, // Si no hay fecha de inicio, usar la fecha de lectura
        externalId: olid, // Guardar el identificador único de OpenLibrary
      };
      
      await addBook(newBook);
      setSuccessMessage("Book added successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onSuccess();
      }, 2000);
      setIsRating(false);
    } catch (err) {
      console.error('Error adding book to library:', err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      {!isRating ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsRating(true)}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Mark as Read
        </Button>
      ) : (
        <div className="flex flex-col items-start gap-3 p-3 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="font-medium text-gray-700">Rate this book:</h3>
          <Rating
            name="book-rating"
            value={rating}
            precision={0.5}
            onChange={(event, newValue) => setRating(newValue || 0)}
          />
          <div className="space-y-3 w-full">
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
              <p className="text-xs text-gray-500 mt-1">Si se deja en blanco, se usará la fecha de finalización</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 block mb-1">Fecha de finalización:</label>
              <DatePicker
                selected={readDate}
                onChange={(date) => setReadDate(date || new Date())}
                dateFormat="dd/MM/yyyy"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                maxDate={new Date()}
                minDate={startDate || undefined}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToRead}
              className="bg-teal-600 hover:bg-teal-700"
              size="small"
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsRating(false)}
              size="small"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default MarkAsReadBtn;
