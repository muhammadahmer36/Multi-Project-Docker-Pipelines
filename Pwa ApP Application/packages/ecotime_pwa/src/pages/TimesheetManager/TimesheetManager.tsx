import {
  StyledTextField,
  TimesheetHeader,
  TimesheetManagerApprovedListActionButton,
} from 'components';
import BottomBar from 'layout/bottomBar/bottomBar';
import {
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ListHeader from './TimesheetList/Header';
import ApprovedPopup from './ApprovedPopup';
import List from './TimesheetList';
import styles from './TimesheetManager.module.scss';
import UnapprovedPopup from './UnapprovePopup';
import {
  getCheckedItems,
  getEmployeeDetailsList,
  getPayPeriod,
} from './selectors';

export default function TimeSheetManager() {
  const data = useSelector(getEmployeeDetailsList) || [];
  const [t] = useTranslation();
  const payPeriod = useSelector(getPayPeriod);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const checkedItems = useSelector(getCheckedItems);
  const isItemsChecked = (() => {
    const isChecked = checkedItems.some((item: boolean) => item);
    return isChecked;
  })();

  return (
    <div className={styles.timesheetContainer}>
      <div className={styles.header}>
        <TimesheetHeader hideRoleSwaping={isItemsChecked} />
      </div>
      <div className={styles.timesheet}>
        <div className={styles.payPeriod}>
          <StyledTextField
            label={t('payPeriod')}
            value={payPeriod.description}
            contentEditable={false}
          />
        </div>

        <div className={styles.list}>
          {data.length === 0 && <ListHeader />}
          {data.length === 0 ? (
            <div className={styles.noDataFound}>
              {t('noTimesheetContent')}
            </div>
          )
            : (
              <div ref={listContainerRef} className={styles.listContainer}>
                <List listContainerRef={listContainerRef} />
              </div>
            )}

          <TimesheetManagerApprovedListActionButton />
          <ApprovedPopup />
          <UnapprovedPopup />
        </div>
        <div className={styles.footer}>
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
