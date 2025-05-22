import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getReportedHours } from 'pages/TimesheetDaily/selectors';
import styles from './Header.module.scss';

export default function Header() {
  const [t] = useTranslation();
  const reportedHour = useSelector(getReportedHours);

  return (
    <div
      className={styles.mainContainer}
    >
      {t('Reported')}
      :
      <div className={styles.hours}>
        {reportedHour}
      </div>
    </div>
  );
}
