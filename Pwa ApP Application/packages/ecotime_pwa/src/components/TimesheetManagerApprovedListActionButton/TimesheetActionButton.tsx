import Approved from './Approved';
import Search from './Search';
import styles from './TimesheetActionButton.module.scss';
import UnApproved from './UnApproved';

export default function ActionButton() {
  return (
    <div className={styles.container}>
      <Approved />
      <UnApproved />
      <Search />
    </div>
  );
}
