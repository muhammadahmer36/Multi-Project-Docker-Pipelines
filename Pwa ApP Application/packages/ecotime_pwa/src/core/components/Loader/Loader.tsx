import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import styles from './Loader.module.scss';
import { getLoader } from './selector';

function Loader() {
  const showLoader = useSelector(getLoader);

  if (showLoader) {
    return (

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 6,
          display: 'flex',
          flexDirection: 'column',
        }}
        open={showLoader}
      >
        <CircularProgress className={styles.loader} />
      </Backdrop>
    );
  }
  return null;
}

export default Loader;
