import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import certify from 'assets/img/certify.svg';
import uncertify from 'assets/img/uncertify.svg';
import { getPayPeriodSummary } from 'pages/Timesheet/selectors';
import { certifyTimesheet, setVisibleCertifyPopup } from 'pages/Timesheet/slice';
import { TimesheetActions } from 'pages/dashboard/types';
import { useManagerSelectedTimesheet } from 'common/hooks';
import styles from './Certify.module.scss';

export default function Certify() {
  const { completeStatus_Code: completeStatus } = useSelector(getPayPeriodSummary) || {};
  const dispatch = useDispatch();
  const { empNo } = useManagerSelectedTimesheet();

  const onCertify = () => {
    if (completeStatus) {
      dispatch(certifyTimesheet({
        actionId: TimesheetActions.UnCertitfy,
        employeeNumber: empNo || undefined,
      }));
    } else {
      dispatch(setVisibleCertifyPopup(true));
    }
  };

  return (
    <IconButton onClick={onCertify}>
      <img
        src={completeStatus ? uncertify : certify}
        alt="certify"
        className={styles.image}
      />
    </IconButton>
  );
}
