import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import {
  BalanceHeader, Geofencing, StyledTextField,
} from 'components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BottomBar from 'layout/bottomBar/bottomBar';
import Typography from '@mui/material/Typography';
import { Resource } from 'common/types/types';
import { getBalanceDate, getBalanceRole, getBalanceUserCurrentRole } from 'pages/Balances/selectors';
import { getHeaderInfo } from './selectors';
import { getCategories, setBalanceCategories, setBalanceGroupDetails } from './slice';
import List from './List';
import { CategoryProps } from './types';
import TabPanel from './TabPanel';
import Detail from './Detail';
import styles from './BalanceCategory.module.scss';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BalanceCategory() {
  const hideRoleIcon = true;
  const dispatch = useDispatch();
  const location = useLocation();
  const [t] = useTranslation();
  const [tabValue, setTabValue] = React.useState(0);
  const headerInfo = useSelector(getHeaderInfo);
  const balanceDate = useSelector(getBalanceDate);
  const userCurrentRole = useSelector(getBalanceUserCurrentRole);
  const userRole = useSelector(getBalanceRole);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { state } = location;
  const {
    balanceGroupId, category, employeeNumber, sectionName,
  } = state;
  const params: CategoryProps = {
    date: balanceDate,
    balanceGroupId,
    category,
    employeeNumber,
    sectionName,
  };
  const tabIndicatorProps = { className: styles.activeTab };

  useEffect(() => {
    dispatch(getCategories(params));

    return () => {
      dispatch(setBalanceCategories([]));
      dispatch(setBalanceGroupDetails([]));
    };
  }, [balanceDate]);

  return (
    <div>
      <BalanceHeader
        hideRoleIcon={hideRoleIcon}
        formLabel={sectionName}
        currentUserRole={userCurrentRole}
        userRole={userRole}
      />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.Balances} />
      <main className={styles.balances}>
        <Geofencing.GeofencingResource resourceId={Resource.Balances}>
          <Typography
            className={styles.heading}
          >
            {`${t('category')}: ${params.category}`}
          </Typography>

          <Box mt={2} mb={2}>
            <StyledTextField
              value={balanceDate}
              label={headerInfo?.tableTitle || ''}
            />
          </Box>
          <Tabs
            TabIndicatorProps={tabIndicatorProps}
            value={tabValue}
            onChange={handleChange}
            className={styles.border}
          >
            <Tab className={styles.tab} label={t('summary')} {...a11yProps(0)} />
            <Tab className={styles.tab} label={t('details')} {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <List />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Detail />
          </TabPanel>
        </Geofencing.GeofencingResource>
      </main>
      <BottomBar />
    </div>
  );
}
export default BalanceCategory;
