import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useManagerSelectedTimesheet } from 'common/hooks';
import useTimesheetManagerView from 'common/hooks/useTimesheetManagerView';
import { Resource } from 'common/types/types';
import {
  DropDown, Geofencing, StyledTextField, TimesheetActionButton, TimesheetHeader,
} from 'components';
import { ListItem } from 'components/DropDown/types';
import TabPanel from 'components/TabPanel';
import BottomBar from 'layout/bottomBar/bottomBar';
import { getTimesheetWeeklyList } from 'pages/TimesheetWeekly/slice';
import React, {
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import ReportedList from './ReportedList';
import Status from './Status';
import {
  getCalculatedHours,
  getPayPeriod,
  getPayPeriodList,
  getReportedHours,
  getSelectedTab,
} from './selectors';
import { getTimesheetList, setPayPeriod, setSelectedTab } from './slice';
// import ActionButton from './ActionButton';
import CalculatedList from './CalculatedList';
import CertifyPopup from './CertifyPopup';
import InformationPopup from './InformationPopup';
import styles from './TimeSheet.module.scss';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TimeSheet() {
  const selectedTab = useSelector(getSelectedTab);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const payPeriodList = useSelector(getPayPeriodList);
  const payPeriod = useSelector(getPayPeriod);
  const reportedHours = useSelector(getReportedHours);
  const calculatedHours = useSelector(getCalculatedHours);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const timesheetManagerView = useTimesheetManagerView();
  const { empNo } = useManagerSelectedTimesheet();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setSelectedTab(newValue));
  };

  const onChangePayCode = (value: string | undefined) => {
    if (value) {
      const selectedItem = payPeriodList.find((item: ListItem) => item.code === value);
      dispatch(getTimesheetList({
        periodIdentity: Number(selectedItem.code),
        employeeNumber: empNo,
      }));
      dispatch(getTimesheetWeeklyList({
        periodIdentity: Number(selectedItem.code),
        employeeNumber: empNo,
      }));
      dispatch(setPayPeriod(selectedItem));
    }
  };

  const tabIndicatorProps = { className: styles.activeTab };

  return (
    <div className={styles.timesheetContainer}>
      <div className={styles.header}>
        <TimesheetHeader />
      </div>
      <Geofencing.GeofencingResourceAlert resourceId={Resource.Timesheet} />
      <div className={styles.timesheet}>
        <Geofencing.GeofencingResource resourceId={Resource.Timesheet}>
          <div className={styles.information}>
            <Avatar />
            <Status />
          </div>

          <div className={styles.payPeriod}>
            {timesheetManagerView
              ? (
                <StyledTextField
                  label={t('payPeriod')}
                  value={payPeriod.description}
                  contentEditable={false}
                />
              )
              : (
                <DropDown
                  label={t('payPeriod')}
                  error={false}
                  onChange={onChangePayCode}
                  list={payPeriodList}
                  value={payPeriod}
                  disabled={timesheetManagerView}
                />
              )}
          </div>

          <div className={styles.tabs}>
            <div ref={listContainerRef} className={styles.listContainer}>
              <Tabs
                TabIndicatorProps={tabIndicatorProps}
                value={selectedTab}
                onChange={handleChange}
                className={styles.border}
              >
                <Tab className={styles.tab} label={t('reported', { hours: reportedHours })} {...a11yProps(0)} />
                <Tab className={styles.tab} label={t('calculated', { hours: calculatedHours })} {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={selectedTab} index={0}>
                <ReportedList listContainerRef={listContainerRef} />
              </TabPanel>
              <TabPanel value={selectedTab} index={1}>
                <CalculatedList listContainerRef={listContainerRef} />
              </TabPanel>
            </div>
            <TimesheetActionButton />
          </div>
          <CertifyPopup />
          <InformationPopup />
        </Geofencing.GeofencingResource>
        <div className={styles.footer}>
          <BottomBar />
        </div>
      </div>
    </div>
  );
}

export default React.memo(TimeSheet);
