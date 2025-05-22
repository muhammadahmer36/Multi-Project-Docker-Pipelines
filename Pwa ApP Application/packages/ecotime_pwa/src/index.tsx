import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import { OfflineModal } from 'components';
import App from 'app/app';
import Popup from 'components/Popup';
import Loader from 'core/components/Loader';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';
import './index.scss';
import './utilities/i18n';
import { MsalProvider } from '@azure/msal-react';
import initializeMsal from 'utilities/msal';
import store, { persistedStore } from './redux/store';

const msalInstance = initializeMsal();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
      <BrowserRouter>
        <Loader />
        <OfflineModal.Provider>
          <ThemeProvider theme={theme}>
            <Popup />
            <MsalProvider instance={msalInstance}>
              <App />
            </MsalProvider>
          </ThemeProvider>
        </OfflineModal.Provider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
