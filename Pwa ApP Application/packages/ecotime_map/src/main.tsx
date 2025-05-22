import React from 'react';
import ReactDOM from 'react-dom/client';
import { GeofencingProvider } from './provider/geofencing';
import './index.scss';
import { SnackbarProvider } from './provider/snackbar'; // Assuming provider directory is in the same directory as index.js
import AppRoutes from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { setValueInSessionStorage } from 'core/utils';

const fetchToken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    setValueInSessionStorage('token', token);
  }
};

(() => {
  fetchToken();
})();

export const AppRoot = () => {
 
  return (
    <React.StrictMode>
      <Router>
        <SnackbarProvider>
          <GeofencingProvider>
            <AppRoutes />
          </GeofencingProvider>
        </SnackbarProvider>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<AppRoot />);
