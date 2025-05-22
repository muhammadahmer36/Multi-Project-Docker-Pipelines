import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Snackbar from 'components/SnackBar';
import { Severity } from 'components/SnackBar/types';
import { additionalInformation } from 'appConstants';
import { setOffline, setShowInternetRestoredSnackbar } from './slice';
import { getConnectivity, getShowInternetRestoredSnackbar } from './selector';
import styles from './ConnectivityStatusBar.module.scss';

function ConnectivityStatusBar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const offline = useSelector(getConnectivity);
  const showInternetRestoredSnackbar = useSelector(getShowInternetRestoredSnackbar);
  const [t] = useTranslation();
  const firstRenderRef = useRef(true);
  const { pathname } = location;

  const closeInternetRestoredSnackbar = () => {
    dispatch(setShowInternetRestoredSnackbar(false));
  };

  useEffect(() => {
    const handleOffline = () => {
      dispatch(setOffline(true));
      if (!firstRenderRef.current) {
        dispatch(setShowInternetRestoredSnackbar(true));
      }
    };

    const handleOnline = () => {
      dispatch(setOffline(false));
    };
    const setInitialOnlineStatus = () => {
      if (navigator.onLine) {
        handleOnline();
      } else {
        handleOffline();
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    setInitialOnlineStatus();
    firstRenderRef.current = false;

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (offline === true) {
    return (
      <div className={styles.container}>
        <Snackbar
          open
          message={t('noInternetConnection')}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1,
          }}
          alertProps={{
            severity: Severity.ERROR,
            sx: {
              width: '100%',
              textAlign: 'center',
            },
          }}
        />
      </div>
    );
  }

  if (showInternetRestoredSnackbar === true) {
    return (
      <div className={styles.container}>
        <Snackbar
          autoHideDuration={6000}
          open={showInternetRestoredSnackbar}
          onClose={closeInternetRestoredSnackbar}
          message={t('internetConnected')}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1,
          }}
          alertProps={{
            severity: Severity.SUCCESS,
            sx: {
              width: '100%',
              textAlign: 'center',
            },
          }}
        />
      </div>
    );
  }
  if (pathname === additionalInformation) {
    <div className={styles.container} />;
  }

  return null;
}

export default ConnectivityStatusBar;
