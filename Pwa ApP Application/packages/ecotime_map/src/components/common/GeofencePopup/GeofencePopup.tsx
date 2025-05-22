import React, { useEffect, useState } from 'react';
import { GeofenceForm } from './types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Geofence } from 'api/types';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: GeofenceForm) => void;
  onUpdate: (form: Geofence) => void;
  editable?: boolean,
  data?: Geofence
}

const Popup: React.FC<PopupProps> = ({ open, onClose, onSave, onUpdate, data }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isDirty, setDirty] =  useState(false);
  const titleMaxLength = 50; 
  const descriptionMaxLength = 250; 
  const buttonText = data ? 'Update' : 'Save'
  const popupTitle = data ? 'Update Polygon' : 'Add Polygon'
  const disabledButton = !title.trim() || !isDirty

  useEffect(() => {
    if(data?.title){
      setTitle(data.title)
      setDescription(data.description || '')
    }
  }, [data]);

  const actionHandler = () => {
    if (title.trim() === '') {
      setShowAlert(true);
    } else {
      data ? onUpdate({ ...data ,title, description }) : onSave({ title, description });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDirty(false);
    onClose();
    setShowAlert(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      actionHandler();
    }
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setDirty(true);
  }

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
    setDirty(true);
  }

  return (
    <Dialog onBackdropClick={handleClose} onKeyDown={handleKeyDown} open={open} onClose={onClose}>
      <DialogTitle>{popupTitle}</DialogTitle>
      <DialogContent>
        <TextField
          id="title-input"
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={onChangeTitle}
          inputProps={{ maxLength: titleMaxLength }}
          required
        />
        <TextField
          id="description-input"
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={onChangeDescription}
          inputProps={{ maxLength: descriptionMaxLength }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={actionHandler}
          variant="contained"
          color="primary"
          disabled={disabledButton} // Disable button if title is empty
        >
          {buttonText}
        </Button>
      </DialogActions>
      {showAlert && (
        <Alert severity="error" onClose={() => setShowAlert(false)}>
          Title is required.
        </Alert>
      )}
    </Dialog>
  );
};

export default Popup;
