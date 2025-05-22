import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import Alert from 'components/Alert';
import { AlertProps } from 'components/Alert/Alert';

interface SnackBarProps extends SnackbarProps {
    message: React.ReactNode;
    alertProps?: AlertProps;
    onClose?: () => void
  }

function SnackBar({
  message,
  alertProps,
  onClose,
  ...otherProps
}: SnackBarProps) {
  const convertBrToReact = ((): React.ReactNode => {
    if (message) {
      const parts = message.toString().split(/(<br>)/g);
      // eslint-disable-next-line react/no-array-index-key
      return parts.map((part: string, index: number) => (part === '<br>' ? <br key={index} /> : part));
    }
    return message;
  })();

  return (
    <Snackbar {...otherProps} onClose={onClose}>
      <Alert onClose={onClose} {...alertProps}>
        {convertBrToReact}
      </Alert>
    </Snackbar>
  );
}

export default SnackBar;
