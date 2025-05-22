import {
  ReactNode,
  createContext, useCallback, useContext, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getOfflineQueue, getOnline, getProcessingQueue } from 'core/offline/selectors';
import Snackbar from 'components/SnackBar';
import { Severity } from 'components/SnackBar/types';
import styles from './OfflineModals.module.scss';

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
interface ModalContextProps {
  showOpenOfflineActionSnackBar: () => void;
  setOfflineMessage: (param: string) => void;
}

interface OfflineModalProps {
  children: ReactNode;
}

export const OfflineModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModalContext = (): ModalContextProps => {
  const context = useContext(OfflineModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export function OfflineModalProvider({ children }: OfflineModalProps) {
  const [openOfflineActionSnackBar, setOpenOfflineActionSnackBar] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState('');
  const proccesingQueue = useSelector(getProcessingQueue);
  const queue = useSelector(getOfflineQueue);
  const online = useSelector(getOnline);
  const [t] = useTranslation();

  const showOpenOfflineActionSnackBar = useCallback(() => {
    if (!online) {
      setOpenOfflineActionSnackBar(true);
    }
  }, [online]);

  const handleCloseOfflineActionSnackBar = useCallback(() => {
    setOpenOfflineActionSnackBar(false);
  }, []);

  const value = {
    setOfflineMessage,
    showOpenOfflineActionSnackBar,
  };
  return (
    <OfflineModalContext.Provider
      value={value}
    >
      <Snackbar
        autoHideDuration={6000}
        open={openOfflineActionSnackBar}
        onClose={handleCloseOfflineActionSnackBar}
        message={offlineMessage}
        style={{ zIndex: 2 }}
        sx={{
          mb: 7,
        }}
        alertProps={{
          severity: Severity.WARNING,
          sx: { width: '100%' },
        }}
      />
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: 'flex',
          flexDirection: 'column',
        }}
        open={proccesingQueue}
      >
        <CircularProgress className={styles.circularProgessOffline} />
        <Typography>
          {queue.length > 0 && (
            t('proccessingOfflineCalls', { numberOfCalls: queue.length })
          )}
        </Typography>
      </Backdrop>
      {children}
    </OfflineModalContext.Provider>
  );
}
