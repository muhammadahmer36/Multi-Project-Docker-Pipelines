import IconButton from '@mui/material/IconButton';
import calculates from 'assets/img/calculates.svg';
import { getPayPeriodSummary } from 'pages/Timesheet/selectors';
import { calculateTimesheet } from 'pages/Timesheet/slice';
import { TimesheetActions } from 'pages/dashboard/types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Calculate.module.scss';

export default function Delete() {
  const dispatch = useDispatch();
  const { completeStatus_Code: completeStatus, approveStatus_Code: approveStatus } = useSelector(getPayPeriodSummary) || {};

  const onCalculcate = () => {
    dispatch(calculateTimesheet({
      actionId: TimesheetActions.Calculate,
    }));
  };

  if ((completeStatus || approveStatus)) {
    return null;
  }

  return (
    <IconButton onClick={onCalculcate}>
      <img
        src={calculates}
        alt="calculate"
        className={styles.image}
      />
    </IconButton>
  );
}
