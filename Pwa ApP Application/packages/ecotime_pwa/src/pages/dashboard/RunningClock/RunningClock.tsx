import useRunningClocking from 'core/runningClockSyncing/hooks/useRunningClock';
import { formatDateToLocale, formatTimeToLocale } from 'core/utils';
import { useSelector } from 'react-redux';
import { getDateAndTimeFormat } from 'pages/dashboard/selectors';
import styles from './RunningClock.module.scss';

export default function RunningClock() {
  const dateTimeRunningClock = useRunningClocking();
  const { dateTimeFormatClockWidget } = useSelector(getDateAndTimeFormat);

  if (dateTimeFormatClockWidget && dateTimeRunningClock) {
    return (
      <>
        <div className={styles.accordianDetail}>
          <div className={styles.dateHeading}>
            {formatDateToLocale(dateTimeRunningClock)}
          </div>
        </div>
        <div className={styles.accordianDetail}>
          <div className={styles.timeHeading}>
            {formatTimeToLocale(dateTimeRunningClock, dateTimeFormatClockWidget)}
          </div>
        </div>
      </>
    );
  }
  return null;
}
