import { useDispatch, useSelector } from 'react-redux';
import Snackbar from 'components/SnackBar';
import { closePopup } from './slice';
import { getConfiguration, getVisible } from './selectors';

export default function Popup() {
  const dispatch = useDispatch();
  const isOpen = useSelector(getVisible);
  const { message, severity } = useSelector(getConfiguration);

  const handleClose = () => {
    dispatch(closePopup());
  };

  return (

    <Snackbar
      autoHideDuration={6000}
      open={isOpen}
      style={{ zIndex: 5 }}
      alertProps={{
        severity,
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        mb: 7.6,
      }}
      onClose={handleClose}
      message={message}
    />
  );
}
