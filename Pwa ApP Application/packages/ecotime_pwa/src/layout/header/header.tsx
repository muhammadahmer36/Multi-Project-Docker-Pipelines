import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {
  balances, about, previousPage, timeOff, timesheet,
} from 'appConstants';
import { StyledIconButton } from 'components';
import { resetGeolocation } from 'core/geolocation/slice';
import { resetInternetStatusBar } from 'components/InternetStatusBar/slice';
import ConnectivityStatusBar from 'components/InternetStatusBar';
import { resetPermission } from 'common/slice/permissions';
import { dashboard } from 'appConstants';
import { removeItemFromSessionStorage } from 'utilities';
import { resetAddTimeOfRequestFormValues } from 'pages/TimeOffCalendar/slice';
import { getAuthenticationTypeId } from 'common/selectors/common';
import { IHeaderProps } from './types';
import SideMenuDrawer from './SideMenuDrawer';
import { useLogoutRedirect } from './redirectOnLogout';
import './header.scss';

function Header({ formLabel, sx }: IHeaderProps) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logoutRedirect = useLogoutRedirect();
  const authenticationId = useSelector(getAuthenticationTypeId);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(7);

  const resetActions = () => {
    dispatch(resetGeolocation());
    dispatch(resetPermission());
    dispatch(resetInternetStatusBar());
  };

  const logOut = async () => {
    removeItemFromSessionStorage('accessToken');
    removeItemFromSessionStorage('refreshToken');
    dispatch(resetAddTimeOfRequestFormValues());
    logoutRedirect(authenticationId);
    resetActions();
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    if (index === 0) {
      navigate(balances);
    }
    if (index === 5) {
      navigate(about);
    }
    if (index === 1) {
      navigate(timeOff);
    }
    if (index === 2) {
      navigate(timesheet);
    }
    if (index === 4) {
      setTimeout(() => {
        logOut();
      }, 100);
    }
  };

  const onClickIconButton = () => {
    if (!formLabel) {
      setOpenDrawer(true);
    } else if (pathname === timeOff) {
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

  const closeSideMenu = () => {
    setOpenDrawer(false);
  };

  const openSideMenu = () => {
    setOpenDrawer(true);
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
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <StyledIconButton
              IconSize="small"
              className="colorPrimary"
              edge="start"
              testId="et-icon"
              onClick={onClickIconButton}
              icon={renderHeaderIcon()}
            />
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 700,
                textAlign: 'center',
                color: '#0E404A',
                paddingTop: '3px',
                paddingRight: '34px',
                fontSize: '17px',
              }}
            >
              {formLabel}
            </Typography>
            <div />
          </Toolbar>
        </AppBar>
        {pathname === dashboard && (
          <SideMenuDrawer
            open={openDrawer}
            openDrawer={openSideMenu}
            closeDrawer={closeSideMenu}
            selectedIndex={selectedIndex}
            handleListItemClick={handleListItemClick}
          />
        )}
      </Box>
      <ConnectivityStatusBar />
    </>
  );
}

export default Header;
