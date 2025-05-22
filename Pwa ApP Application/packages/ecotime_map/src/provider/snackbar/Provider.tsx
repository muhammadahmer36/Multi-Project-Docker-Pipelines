import React, { ReactNode, createContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Define a type for the alert variant
export type AlertVariant = 'error' | 'success' | 'warning';

// Define a type for the alert context
interface SnackbarContextType {
  showSnackbar: (message: string, variant: AlertVariant) => void;
}

// Create an alert context
export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);


interface SnackbarProviderProps {
    children: ReactNode;
}
// Custom hook to use the alert context


// AlertProvider component to wrap the application
 export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<AlertVariant>('success');

  const showSnackbar = (message: string, variant: AlertVariant) => {
    setMessage(message);
    setVariant(variant);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar open={open}   
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={variant} sx={{ width: '400px'}}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

