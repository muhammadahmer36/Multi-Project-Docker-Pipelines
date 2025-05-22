import approved from 'assets/img/approved.svg';
import certified from 'assets/img/certified.svg';
import { useSelector } from 'react-redux';
import styles from './Status.module.scss';
import { getPayPeriodSummary } from '../selectors';

export default function Status() {
  const { completeStatus_Code: completeStatus, approveStatus_Code: approveStatus } = useSelector(getPayPeriodSummary) || {};
  return (
    <>
      {completeStatus
      && (
      <img
        src={certified}
        alt="certified"
        className={styles.image}
      />
      )}
      {approveStatus
      && (
      <img
        src={approved}
        alt="approved"
        className={styles.image}
      />
      )}
    </>
  );
}
