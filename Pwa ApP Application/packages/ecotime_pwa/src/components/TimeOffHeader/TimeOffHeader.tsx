import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {
  previousPage, timeOff,
  timeOffSearch,
} from 'appConstants';
import { StyledIconButton } from 'components';
import ConnectivityStatusBar from 'components/InternetStatusBar';
import { dashboard } from 'appConstants';
import { UserRole } from 'common/types/types';
import { SxProps } from '@mui/material/styles';
import SwitchRoleButton from './SwitchRoleButton';
import HeaderTitle from './HeaderTitle';
import styles from './TimeOffHeader.module.scss';

interface Props {
  formLabel?: string | '',
  sx?: SxProps;
  handleClickOnManagerIcon?: () => void
  handleClickOnEmployeeIcon?: () => void
  userRole?: number
  currentUserRole?: number
  hideRoleIcon?: boolean
  hideBackButton?: boolean
}

function Header(props: Props) {
  const {
    formLabel, sx, userRole, handleClickOnManagerIcon, handleClickOnEmployeeIcon,
    hideRoleIcon, hideBackButton, currentUserRole,
  } = props;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onClickIconButton = () => {
    if (pathname === timeOff
      || pathname === timeOffSearch
    ) {
      navigate(dashboard);
    } else {
      navigate(previousPage);
    }
  };

  const renderHeaderIcon = () => {
    if (formLabel) {
      return <ArrowBackIosRoundedIcon />;
    }
    return <MenuIcon />;
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, ...sx }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: '#fff',
            boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2)',
          }}
        >
          <Toolbar className={styles.headerContainer}>
            <Grid
              container
              display="flex"
              alignItems="center"
            >
              <Grid item xs={1} md={1}>
                {!hideBackButton
                  && (
                    <StyledIconButton
                      IconSize="small"
                      className="colorPrimary"
                      edge="start"
                      testId="et-icon"
                      onClick={onClickIconButton}
                      icon={renderHeaderIcon()}
                    />
                  )}
              </Grid>
              <Grid
                item
                xs={10}
                md={10}
              >
                <HeaderTitle
                  currentUserRole={currentUserRole}
                  title={formLabel}
                  userRole={userRole}
                />
              </Grid>
              <Grid
                item
                xs={1}
                display="flex"
                justifyContent="flex-end"
                md={1}
              >
                {
                  userRole === UserRole.Both
                  && (
                    <SwitchRoleButton
                      currentUserMode={currentUserRole}
                      hideRoleIcon={hideRoleIcon}
                      handleClickOnManagerIcon={handleClickOnManagerIcon}
                      handleClickOnEmployeeIcon={handleClickOnEmployeeIcon}
                    />
                  )
                }
              </Grid>
            </Grid>
            <div />
          </Toolbar>
        </AppBar>
      </Box>
      <ConnectivityStatusBar />
    </>
  );
}

export default Header;
