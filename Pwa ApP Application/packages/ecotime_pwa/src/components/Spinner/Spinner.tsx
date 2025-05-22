import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Spinner.module.scss';

interface LoaderProps {
  showLoader: boolean;
}

function Loader({ showLoader }: LoaderProps): JSX.Element | null {
  return showLoader ? (
    <Box className={styles.loaderContainer}>
      <CircularProgress size="2rem" className={styles.loaderColor} />
    </Box>
  ) : null;
}

export default Loader;
