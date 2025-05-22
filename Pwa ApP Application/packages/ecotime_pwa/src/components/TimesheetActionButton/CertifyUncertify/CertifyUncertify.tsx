import IconButton from '@mui/material/IconButton';
import { timesheetCertifyUncertify } from 'appConstants';
import certifyUncertify from 'assets/img/certifyUncertify.svg';
import { getTimesheetCertifyUncertifyList } from 'pages/TimesheetCertifyUncertify/slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentDate, getLastDateOfSpecificMonth } from 'core/utils';
import styles from './CertifyUncertify.module.scss';

export default function CertifyUncertify() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCertifyUncertify = () => {
    const currentDate = getCurrentDate();
    const date = getLastDateOfSpecificMonth(currentDate);
    dispatch(getTimesheetCertifyUncertifyList({ date }));
    navigate(timesheetCertifyUncertify);
  };

  return (
    <IconButton onClick={onCertifyUncertify}>
      <img
        src={certifyUncertify}
        alt="certifyUncertify"
        className={styles.image}
      />
    </IconButton>
  );
}
