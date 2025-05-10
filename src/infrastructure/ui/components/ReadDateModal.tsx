import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

interface ReadDateModalProps {
  open: boolean;
  onClose: () => void;
  readDate?: Date;
  onChange: (date: Date) => void;
  onSave: () => void;
}

/**
 * Modal component for editing the read date of a book
 */
const ReadDateModal: React.FC<ReadDateModalProps> = ({
  open,
  onClose,
  readDate,
  onChange,
  onSave,
}) => {
  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Read Date</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Read Date"
            value={readDate || null}
            onChange={(newDate) => {
              if (newDate) {
                onChange(newDate);
              }
            }}
            slotProps={{ textField: { margin: "normal", fullWidth: true } }}
          />
        </LocalizationProvider>
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
