import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Calender, Geofencing } from 'components';
import TabPanel from 'components/TabPanel';
import BottomBar from 'layout/bottomBar/bottomBar';
import Header from 'layout/header/header';
import React, {
  useEffect,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentDate } from 'core/utils';
import { Resource } from 'common/types/types';
import List from './List';
import styles from './TimesheetCertifyUncertify.module.scss';
import {
  getCertifyList,
  getDate,
  getUncertifyList,
} from './selectors';
import { reset, setDate } from './slice';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TimesheetCertifyUncertify() {
  const [tabValue, setTabValue] = React.useState(0);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const certifyList = useSelector(getCertifyList);
  const uncertifyList = useSelector(getUncertifyList);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const date = useSelector(getDate);
  const currentDate = getCurrentDate();
  const selectedDate = date || currentDate;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onDateChange = (value: string | undefined) => {
    if (value) {
      dispatch(setDate(value));
    }
  };

  useEffect(() => () => {
    dispatch(reset());
  }, []);

  const tabIndicatorProps = { className: styles.activeTab };

  return (
    <div className={styles.timesheetContainer}>
      <Header
        formLabel={t('timesheet')}
      />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.Timesheet} />
      <div className={styles.timesheet}>
        <Geofencing.GeofencingResource resourceId={Resource.Timesheet}>
          <div className={styles.date}>
            <Calender
              viewMode={['year', 'month']}
              dateValue={selectedDate}
              format="MMMM,YYYY"
              calendarLabel={t('month')}
              onDateSelect={onDateChange}
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
                <Tab className={styles.tab} label={t('certified')} {...a11yProps(0)} />
                <Tab className={styles.tab} label={t('uncertified')} {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <List data={certifyList} listContainerRef={listContainerRef} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <List data={uncertifyList} listContainerRef={listContainerRef} />
              </TabPanel>
            </div>
          </div>
        </Geofencing.GeofencingResource>
        <div className={styles.footer}>
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
