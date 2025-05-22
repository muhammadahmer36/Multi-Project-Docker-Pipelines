import React, {
  useEffect, useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabPanel from 'components/TabPanel';
import BottomBar from 'layout/bottomBar/bottomBar';
import { getPayPeriod } from 'pages/Timesheet/selectors';
import {
  DropDown, Geofencing, StyledTextField, TimesheetActionButton,
  TimesheetHeader,
} from 'components';
import { ListItem } from 'components/DropDown/types';
import { Resource } from 'common/types/types';
import { TimesheetActions } from 'pages/dashboard/types';
import { useLocation } from 'react-router-dom';
import { certifyUncertifyKey } from 'components/TimesheetActionButton/TimesheetActionButton';
import { aprovedUnapprove } from 'components/TimesheetActionButton/TimesheetActionButtonManager/TimesheetActionButtonManager';
import CalculatedList from './CalculatedList';
import ReportedList from './ReportedList';
import {
  getCalculatedHours,
  getReportedHours,
  getWeek,
  getWeekList,
} from './selectors';
import { setWeek } from './slice';
import styles from './TimesheetWeekly.module.scss';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TimeSheet() {
  const location = useLocation();
  const {
    state,
  } = location;
  const [tabValue, setTabValue] = React.useState(0);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const payPeriod = useSelector(getPayPeriod);
  const weekList = useSelector(getWeekList);
  const week = useSelector(getWeek);
  const reportedHours = useSelector(getReportedHours);
  const calculatedHours = useSelector(getCalculatedHours);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const { Certitfy, UnCertitfy } = TimesheetActions;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onChangeWeek = (value: string | undefined) => {
    if (value) {
      const selectedItem = weekList.find((item: ListItem) => item.code === value);
      dispatch(setWeek(selectedItem));
    }
  };

  useEffect(() => {
    if (state && state.selectedTab) {
      const { selectedTab } = state;
      setTabValue(selectedTab);
    }
  }, [state.selectedTab]);

  const tabIndicatorProps = { className: styles.activeTab };

  return (
    <div className={styles.timesheetContainer}>
      <div className={styles.header}>
        <TimesheetHeader />
      </div>
      <Geofencing.GeofencingResourceAlert resourceId={Resource.Timesheet} />
      <div className={styles.timesheet}>
        <Geofencing.GeofencingResource resourceId={Resource.Timesheet}>
          <div className={styles.payPeriod}>
            <StyledTextField
              label={t('payPeriod')}
              value={payPeriod.description}
              contentEditable={false}
            />
          </div>
          <div className={styles.weeks}>
            <DropDown
              label={t('week')}
              error={false}
              onChange={onChangeWeek}
              list={weekList}
              value={week}
            />
          </div>
          <div className={styles.tabs}>
            <div ref={listContainerRef} className={styles.listContainer}>
              <Tabs
                TabIndicatorProps={tabIndicatorProps}
                value={tabValue}
                onChange={handleChange}
                className={styles.border}
              >
                <Tab className={styles.tab} label={t('reported', { hours: reportedHours })} {...a11yProps(0)} />
                <Tab className={styles.tab} label={t('calculated', { hours: calculatedHours })} {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <ReportedList listContainerRef={listContainerRef} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <CalculatedList listContainerRef={listContainerRef} />
              </TabPanel>
            </div>
            <TimesheetActionButton
              hideActionIds={[Certitfy, UnCertitfy, certifyUncertifyKey, aprovedUnapprove]}
            />
          </div>
        </Geofencing.GeofencingResource>
        <div className={styles.footer}>
          <BottomBar />
        </div>
      </div>
    </div>

  );
}
