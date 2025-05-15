import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BooksContext } from '../context/BooksContext';
import { Book } from '../../../domain/entities/Book';
import Button from '@mui/material/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Componente para editar las fechas de inicio y fin de lectura de un libro
 */
const EditBookDates: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { getBookById, updateBook } = useContext(BooksContext);
  
  const [book, setBook] = useState<Book | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [readDate, setReadDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!bookId) return;
    
    const fetchBook = () => {
      try {
        const foundBook = getBookById(bookId);
        if (foundBook) {
          setBook(foundBook);
          
          // Establecer las fechas iniciales
          if (foundBook.startDate) {
            setStartDate(new Date(foundBook.startDate));
          }
          
          if (foundBook.readDate) {
            setReadDate(new Date(foundBook.readDate));
          }
        } else {
          setError('Libro no encontrado');
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Error al cargar el libro');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [bookId, getBookById]);

  const handleSave = async () => {
    if (!book || !bookId) return;
    
    try {
      // Convertir null a undefined para que coincida con los tipos esperados
      const updates: Partial<Book> = {};
      
      if (startDate !== null) {
        updates.startDate = startDate;
      } else {
        updates.startDate = undefined;
      }
      
      if (readDate !== null) {
        updates.readDate = readDate;
      } else {
        updates.readDate = undefined;
      }
      
      await updateBook(bookId, updates);
      
      setSuccessMessage('Fechas actualizadas correctamente');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error('Error updating book dates:', err);
      setError('Error al actualizar las fechas');
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
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Volver
        </Button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No se encontró el libro</p>
        </div>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Volver
      </Button>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Editar fechas de lectura</h1>
        <h2 className="text-xl text-gray-700 mb-6">{book.title}</h2>
        
        <div className="space-y-6 max-w-md">
          {/* Fecha de inicio de lectura */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de inicio de lectura
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              maxDate={readDate || new Date()}
              placeholderText="Selecciona fecha de inicio"
              isClearable
            />
            <p className="text-xs text-gray-500">
              Si se deja en blanco, se usará la fecha de finalización como fecha de inicio
            </p>
          </div>
          
          {/* Fecha de finalización de lectura */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de finalización de lectura
            </label>
            <DatePicker
              selected={readDate}
              onChange={(date) => setReadDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              maxDate={new Date()}
              minDate={startDate || undefined}
              placeholderText="Selecciona fecha de finalización"
              isClearable={book.status !== 'read'} // Solo permitir borrar si no está marcado como leído
            />
            {book.status === 'read' && (
              <p className="text-xs text-gray-500">
                Esta fecha es obligatoria para libros marcados como leídos
              </p>
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              className="border-gray-300 text-gray-700"
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={book.status === 'read' && !readDate}
            >
              Guardar cambios
            </Button>
          </div>
          
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p>{successMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBookDates;
