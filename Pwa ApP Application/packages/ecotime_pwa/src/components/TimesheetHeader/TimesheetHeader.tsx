/* eslint-disable no-use-before-define */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  dashboard, timesheet, timesheetManager, timesheetSearchManager,
} from 'appConstants';
import { UserRole } from 'common/types/types';
import ConnectivityStatusBar from 'components/InternetStatusBar';
import { getTimesheetRole, getTimesheetUserCurrentRole } from 'pages/Timesheet/selectors';
import { getTimesheetList, setUserCurrentRole } from 'pages/Timesheet/slice';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { reset } from 'pages/TimesheetSearchManager/slice';
import { reset as resetTimesheetManager } from 'pages/TimesheetManager/slice';
import RoleBackButton from './RoleBackButton';
import RoleIconButton from './RoleIconButton';
import styles from './TimesheetHeader.module.scss';

interface Props {
  hideRoleSwaping?: boolean;
}

function Header(props: Props) {
  const { hideRoleSwaping = false } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timesheetUserCurrentRole = useSelector(getTimesheetUserCurrentRole);
  const timesheetUserRole = useSelector(getTimesheetRole);
  const headerTitle = timesheetUserCurrentRole === UserRole.Employee ? t('employee') : t('manager');
  const { pathname } = useLocation();

  const onClickIconButton = () => {
    if (pathname === timesheetSearchManager
      || pathname === timesheetManager
      || (pathname === timesheet
        && timesheetUserRole === UserRole.Both && timesheetUserCurrentRole === UserRole.Employee)
      || (pathname === timesheet && timesheetUserRole === UserRole.Manager)
    ) {
      navigate(dashboard);
      dispatch(reset());
    } else {
      navigate(-1);
    }
  };

  const handleClickOnManager = () => {
    dispatch(reset());
    dispatch(resetTimesheetManager());
    navigate(timesheetSearchManager);
    dispatch(setUserCurrentRole(UserRole.Manager));
  };
  const handleClickOnEmployee = () => {
    dispatch(getTimesheetList({
      periodIdentity: 0,
    }));
    dispatch(reset());
    dispatch(resetTimesheetManager());
    dispatch(setUserCurrentRole(UserRole.Employee));
    navigate(timesheet);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2)' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Grid container alignItems="center">
              <Grid item xs={1} md={1}>
                <RoleBackButton onClickIconButton={onClickIconButton} />
              </Grid>
              <Grid className={styles.headerContainer} item xs={10} md={10}>
                <Typography className={styles.headerTitle}>
                  {t('timesheet')}
                  {timesheetUserRole === UserRole.Both && ` ${headerTitle}`}
                  {timesheetUserRole === UserRole.Manager && ` ${t('manager')}`}
                </Typography>
              </Grid>
              <Grid item xs={1} display="flex" justifyContent="flex-end" md={1}>
                {!hideRoleSwaping
                && (
                <RoleIconButton
                  handleClickOnManager={handleClickOnManager}
                  handleClickOnEmployee={handleClickOnEmployee}
                />
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <ConnectivityStatusBar />
    </>
  );
}

export default Header;
