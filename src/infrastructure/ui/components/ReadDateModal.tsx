import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

interface ReadDateModalProps {
  open: boolean;
  onClose: () => void;
  readDate?: Date;
  startDate?: Date;
  onChangeReadDate: (date: Date | null) => void;
  onChangeStartDate: (date: Date | null) => void;
  onSave: () => void;
}

/**
 * Modal component for editing both start and end reading dates of a book
 */
const ReadDateModal: React.FC<ReadDateModalProps> = ({
  open,
  onClose,
  readDate,
  startDate,
  onChangeReadDate,
  onChangeStartDate,
  onSave,
}) => {
  // Estado local para manejar las fechas durante la edición
  const [localStartDate, setLocalStartDate] = useState<Date | null>(startDate || null);
  const [localReadDate, setLocalReadDate] = useState<Date | null>(readDate || null);
  const [error, setError] = useState<string>('');

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setLocalStartDate(startDate || null);
    setLocalReadDate(readDate || null);
    setError('');
  }, [startDate, readDate, open]);

  // Validar y guardar los cambios
  const handleSave = () => {
    // Validar que la fecha de inicio no sea posterior a la fecha de finalización
    if (localStartDate && localReadDate && localStartDate > localReadDate) {
      setError('La fecha de inicio no puede ser posterior a la fecha de finalización');
      return;
    }

    // Aplicar los cambios
    onChangeStartDate(localStartDate);
    onChangeReadDate(localReadDate);
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar fechas de lectura</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Puedes editar tanto la fecha de inicio como la fecha de finalización de lectura.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Si no recuerdas la fecha exacta de inicio, puedes dejarla en blanco.
          </Typography>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* Fecha de inicio de lectura */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Fecha de inicio de lectura
            </Typography>
            <DatePicker
              label="Fecha de inicio"
              value={localStartDate}
              onChange={(newDate) => {
                setLocalStartDate(newDate);
                setError('');
              }}
              slotProps={{ 
                textField: { 
                  margin: "normal", 
                  fullWidth: true,
                  helperText: "Cuándo empezaste a leer este libro"
                } 
              }}
              maxDate={localReadDate || undefined}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Fecha de finalización de lectura */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Fecha de finalización de lectura
            </Typography>
            <DatePicker
              label="Fecha de finalización"
              value={localReadDate}
              onChange={(newDate) => {
                setLocalReadDate(newDate);
                setError('');
              }}
              slotProps={{ 
                textField: { 
                  margin: "normal", 
                  fullWidth: true,
                  helperText: "Cuándo terminaste de leer este libro"
                } 
              }}
              minDate={localStartDate || undefined}
            />
          </Box>
        </LocalizationProvider>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReadDateModal;
