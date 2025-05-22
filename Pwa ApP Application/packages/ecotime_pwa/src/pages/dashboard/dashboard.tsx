import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledButton,
} from 'components';
import { getInitialsOfFirstAndLastName } from 'utilities';
import Header from 'layout/header/header';
import BottomBar from 'layout/bottomBar/bottomBar';
import {
  timesheet,
  timesheetSearchManager,
  yearMonthDayFormat,
} from 'appConstants';
import timeOffIcon from 'assets/img/timeOff.svg';
import Geofencing from 'components/GeofencingResources';
import { Resource, UserRole } from 'common/types/types';
import { getTimesheetList, setUserCurrentRole } from 'pages/Timesheet/slice';
import {
  getTimeOffRequests, saveEndDateOfTimeOffRequest, saveSelectedEmployees,
  saveSelectedTimesheetGroup, setUserCurrentRole as setUserCurrentRoleTimeOff,
} from 'pages/TimeOffCalendar/slice';
import {
  getBalanceCategories, saveEmployee, setBalanceDate, setUserCurrentRole as setUserCurrentRoleBalance,
  saveSelectedTimesheetGroup as saveTimesheetGroupForBalances,
} from 'pages/Balances/slice';
import {
  formatsMapper, getCurrentFormattedDate, getDateAgainstFormat, getDateInDayJSFormat,
} from 'core/utils';
import { getTimesheetRole } from 'pages/Timesheet/selectors';
import Grid from '@mui/material/Grid';
import { setEmployeeList } from 'common/slice/common';
import {
  getAppInformation,
  getBalances,
  getTimeOff,
  getTimePunches,
  getTimeSheet,
} from './selectors';
import { timePunchingComponents } from './TimePunches/slice';
import TimePunchesAccordion from './TimePunchesAccordion';
import styles from './Dashboard.module.scss';
import { getClockComponentItems } from './TimePunches/selector';

function Dashboard() {
  const noWrapTextLength = 100;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timeOff = useSelector(getTimeOff);
  const timeSheet = useSelector(getTimeSheet);
  const timeSheetRole = useSelector(getTimesheetRole);
  const timePunches = useSelector(getTimePunches);
  const clockComponentItems = useSelector(getClockComponentItems);
  const balances = useSelector(getBalances);
  const location = useLocation();
  const { pathname } = location;
  const shouldBalanceTextWrap = balances?.title?.length >= noWrapTextLength;
  const shouldTimesheetTextWrap = timeSheet?.title?.length >= noWrapTextLength;
  const shouldTimeOffTextWrap = timeOff?.title?.length >= noWrapTextLength;

  const { userEmployeeName } = useSelector(getAppInformation);
  const { Manager } = UserRole;

  useEffect(() => () => {
    dispatch(setUserCurrentRole(UserRole.Employee));
  }, []);

  const navigateToBalance = () => {
    dispatch(setUserCurrentRoleBalance(UserRole.Employee));
    dispatch(setBalanceDate(getCurrentFormattedDate()));
    dispatch(saveEmployee(null));
    dispatch(setEmployeeList([]));
    dispatch(saveTimesheetGroupForBalances(null));
    dispatch(getBalanceCategories({
      date: getCurrentFormattedDate(),
      page: pathname,
      navigate,
    }));
  };

  const navigateToTimeOff = () => {
    dispatch(setUserCurrentRoleTimeOff(UserRole.Employee));
    const dateInYearFormat = getDateAgainstFormat(getDateInDayJSFormat(), formatsMapper[yearMonthDayFormat]);
    dispatch(saveEndDateOfTimeOffRequest(dateInYearFormat));
    dispatch(saveSelectedEmployees([]));
    dispatch(saveSelectedTimesheetGroup(null));
    dispatch(getTimeOffRequests({ date: dateInYearFormat, page: pathname, navigate }));
  };

  const navigateToTimesheet = () => {
    const route = timeSheetRole === Manager ? timesheetSearchManager : timesheet;
    dispatch(getTimesheetList({
      periodIdentity: 0,
      navigate,
      route,
    }));
  };

  useEffect(() => {
    dispatch(timePunchingComponents());
  }, []);

  return (
    <div className={styles.dashboard}>
      <Header />
      {timePunches
      && clockComponentItems.length > 0 && (
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimePunches} />)}
      <main>
        <Box
          mt={1}
          ml={2}
          mr={2}
        >
          <Box className={styles.greetingBox} mb={1.5}>
            <Avatar
              className={styles.avatar}
            >
              {userEmployeeName && getInitialsOfFirstAndLastName(userEmployeeName)}
            </Avatar>
            <Box mt={0.6} ml={1.5}>
              <Typography
                className={styles.greetingMessage}
              >
                {userEmployeeName && `${t('greetingUser', { userName: userEmployeeName })}`}
              </Typography>
            </Box>
          </Box>
          <TimePunchesAccordion isExpanded />
          <Box mt={1.5} />
          {balances
            && (
              <StyledButton
                className={styles.dashBoardButton}
                variant="outlined"
                fullWidth
                disableRipple
                onClick={navigateToBalance}
              >
                <Grid container alignItems="center">
                  <Grid item xs={0.1} md={0.1} xl={0.1} display="flex" justifyContent="flex-start">
                    <TimelapseOutlinedIcon />
                  </Grid>
                  <Grid
                    item
                    xs={10.9}
                    md={10.9}
                    xl={10.9}
                    container
                    display="flex"
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <Grid container>
                      <Grid item xs={12} md={12} xl={12}>
                        <Typography
                          noWrap={shouldBalanceTextWrap}
                          className={styles.title}
                        >
                          {balances?.title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={1} md={1} xl={1} display="flex" justifyContent="flex-end">
                    <NavigateNextOutlinedIcon />
                  </Grid>
                </Grid>
              </StyledButton>
            )}
          <Box mt={1.5} />
          {timeOff
            && (
              <StyledButton
                className={styles.dashBoardButton}
                variant="outlined"
                fullWidth
                disableRipple
                onClick={navigateToTimeOff}
              >
                <Grid container alignItems="center">
                  <Grid item xs={0.1} md={0.1} xl={0.1} display="flex" justifyContent="flex-start">
                    <img src={timeOffIcon} alt="timeOffIcon" />
                  </Grid>
                  <Grid
                    item
                    xs={10.9}
                    md={10.9}
                    xl={10.9}
                    container
                    display="flex"
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <Grid container>
                      <Grid item xs={12} md={12} xl={12}>
                        <Typography
                          noWrap={shouldTimeOffTextWrap}
                          className={styles.title}
                        >
                          {timeOff?.title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={1} md={1} xl={1} display="flex" justifyContent="flex-end">
                    <NavigateNextOutlinedIcon />
                  </Grid>
                </Grid>
              </StyledButton>
            )}
          {timeSheet
            && (
              <Box mt={1.5}>
                <StyledButton
                  className={styles.dashBoardButton}
                  variant="outlined"
                  fullWidth
                  disableRipple
                  onClick={navigateToTimesheet}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={0.1} md={0.1} xl={0.1} display="flex" justifyContent="flex-start">
                      <WorkHistoryOutlinedIcon />
                    </Grid>
                    <Grid
                      item
                      xs={10.9}
                      md={10.9}
                      xl={10.9}
                      container
                      display="flex"
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                    >
                      <Grid container>
                        <Grid item xs={12} md={12} xl={12}>
                          <Typography
                            noWrap={shouldTimesheetTextWrap}
                            className={styles.title}
                          >
                            {timeSheet?.title}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={1} md={1} xl={1} display="flex" justifyContent="flex-end">
                      <NavigateNextOutlinedIcon />
                    </Grid>
                  </Grid>
                </StyledButton>
              </Box>
            )}
        </Box>
      </main>
      <BottomBar />
    </div>
  );
}

export default Dashboard;
