import React, { Ref } from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import styles from './Alert.module.scss';
import { Severity } from './types';

export interface AlertProps extends MuiAlertProps {
  onClose?: () => void;
}

const Alert = React.forwardRef(
  ({ onClose, ...alertProps }: AlertProps, ref: Ref<HTMLDivElement>) => {
    const { severity = Severity.WARNING } = alertProps || {};

    return (
      <MuiAlert
        ref={ref}
        action={
          onClose && (
            <IconButton className={styles.closeIcon} aria-label="close" color="inherit" size="small" onClick={onClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        iconMapping={{
          success: <CheckCircleIcon fontSize="small" className={styles.checkCircleIcon} />,
          warning: <WarningAmberIcon fontSize="small" className={styles.warningAmberIcon} />,
          error: <ErrorIcon fontSize="small" className={styles.errorIcon} />,
        }}
        className={styles[severity]}
        {...alertProps}
      />
    );
  },
);

export default Alert;
