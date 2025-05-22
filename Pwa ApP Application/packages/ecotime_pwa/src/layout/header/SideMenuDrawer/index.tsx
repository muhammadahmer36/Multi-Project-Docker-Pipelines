import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';
import {
  getAppInformation,
  getBalances,
  getTimeOff,
  getTimeSheet,
} from 'pages/dashboard/selectors';
import { APP_VERSION } from 'enviroments';
import { APP_CURRENT_VERSION } from 'appConstants';
import { getInitialsOfFirstAndLastName } from 'utilities';
import { buttonLogOut } from 'appConstants';
import { SideMenuDrawerProps } from './types';

function SideMenuDrawer({
  open,
  closeDrawer,
  openDrawer,
  selectedIndex,
  handleListItemClick,
}: SideMenuDrawerProps) {
  const noWrapTextLength = 50;
  const iOS = typeof navigator !== 'undefined'
    && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [t] = useTranslation();
  const balanceList = useSelector(getBalances);
  const timeOff = useSelector(getTimeOff);
  const timeSheet = useSelector(getTimeSheet);
  const { userEmployeeName } = useSelector(getAppInformation);
  const shouldWrapBalanceText = balanceList?.title?.length >= noWrapTextLength;
  const shouldWrapTimeOffTextWrap = timeOff?.title?.length >= noWrapTextLength;
  const shouldWrapTimeSheetTextWrap = timeSheet?.title?.length >= noWrapTextLength;

  return (
    <SwipeableDrawer
      onClose={closeDrawer}
      onOpen={openDrawer}
      anchor="left"
      PaperProps={{ sx: { width: '300px' } }}
      open={open}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      <div className="et2">
        <Box className="flex jCLeft" mt={4} ml={3} mb={2}>
          <Avatar id="avatarLarge">
            {userEmployeeName
              && getInitialsOfFirstAndLastName(userEmployeeName)}
          </Avatar>
          <Box ml={2} mt={2.6}>
            <Typography
              component="span"
              className="fs20
                fW700
                colorPrimary"
            >
              {userEmployeeName}
            </Typography>
          </Box>
        </Box>
        <Divider variant="middle" className="colorPrimary" />
        <Box mb={2} />
        <Box>
          <List
            component="nav"
            aria-label="main mailbox folders"
            className="width295-px"
          >
            {balanceList && (
              <ListItemButton
                className={`borderForNav-7px ${selectedIndex === 0 ? 'primaryBackGround' : 'whiteBackGround'
                }`}
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon className="minWidth-40px">
                  <TimelapseOutlinedIcon
                    className={`${selectedIndex === 0 ? 'paperColor' : 'colorPrimary'
                    }`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={(
                    <Box
                      sx={{
                        whiteSpace: shouldWrapBalanceText ? 'nowrap' : 'inherit',
                        overflow: shouldWrapBalanceText ? 'hidden' : 'inherit',
                        textOverflow: shouldWrapBalanceText ? 'ellipsis' : 'inherit',
                      }}
                    >
                      <Typography
                        component="span"
                        className={`fW700
                        fs16
                        ${selectedIndex === 0 ? 'paperColor' : 'colorPrimary'}`}
                      >
                        {balanceList?.title}
                      </Typography>
                    </Box>
                  )}
                />
              </ListItemButton>
            )}
            {timeOff
              && (
                <ListItemButton
                  className={`mt10-px borderForNav-7px ${selectedIndex === 1 ? 'primaryBackGround' : 'whiteBackGround'
                  }`}
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1)}
                >
                  <ListItemIcon className="minWidth-40px">
                    <TimerOffOutlinedIcon
                      className={`${selectedIndex === 1 ? 'paperColor' : 'colorPrimary'
                      }`}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={(
                      <Box
                        sx={{
                          whiteSpace: shouldWrapTimeOffTextWrap ? 'nowrap' : 'inherit',
                          overflow: shouldWrapTimeOffTextWrap ? 'hidden' : 'inherit',
                          textOverflow: shouldWrapTimeOffTextWrap ? 'ellipsis' : 'inherit',
                        }}
                      >
                        <Typography
                          className={`fW700 fs16 ${selectedIndex === 1 ? 'paperColor' : 'colorPrimary'
                          }`}
                        >
                          {timeOff?.title}
                        </Typography>
                      </Box>
                    )}
                  />
                </ListItemButton>
              )}

            {timeSheet && (
              <ListItemButton
                className={`mt10-px borderForNav-7px ${selectedIndex === 2 ? 'primaryBackGround' : 'whiteBackGround'
                }`}
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemIcon className="minWidth-40px">
                  <WorkHistoryOutlinedIcon
                    className={`${selectedIndex === 2 ? 'paperColor' : 'colorPrimary'
                    }`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={(
                    <Box
                      sx={{
                        whiteSpace: shouldWrapTimeSheetTextWrap ? 'nowrap' : 'inherit',
                        overflow: shouldWrapTimeSheetTextWrap ? 'hidden' : 'inherit',
                        textOverflow: shouldWrapTimeSheetTextWrap ? 'ellipsis' : 'inherit',
                      }}
                    >
                      <Typography
                        component="span"
                        className={`fW700 fs16 ${selectedIndex === 2 ? 'paperColor' : 'colorPrimary'
                        }`}
                      >
                        {timeSheet?.title}
                      </Typography>
                    </Box>
                  )}
                />
              </ListItemButton>
            )}
            {APP_VERSION !== APP_CURRENT_VERSION && (
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
                className={`mt10-px borderForNav-7px  ${selectedIndex === 3 ? 'primaryBackGround' : 'whiteBackGround'
                }`}
              >
                <ListItemIcon className="minWidth-40px">
                  <SettingsOutlinedIcon
                    className={`${selectedIndex === 3 ? 'paperColor' : 'colorPrimary'
                    }`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={(
                    <Typography
                      component="span"
                      className={`fW700
                          fs16
                          ${selectedIndex === 3 ? 'paperColor' : 'colorPrimary'
                        }`}
                    >
                      {t('settings')}
                    </Typography>
                  )}
                />
              </ListItemButton>
            )}

            <ListItemButton
              id={buttonLogOut}
              className={`mt10-px borderForNav-7px ${selectedIndex === 4 ? 'primaryBackGround' : 'whiteBackGround'
              }`}
              selected={selectedIndex === 4}
              onClick={(event) => {
                handleListItemClick(event, 4);
              }}
            >
              <ListItemIcon className="minWidth-40px">
                <LogoutIcon
                  className={`${selectedIndex === 4 ? 'paperColor' : 'colorPrimary'
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primary={(
                  <Typography
                    component="span"
                    className={`fW700
                        fs16
                        ${selectedIndex === 4 ? 'paperColor' : 'colorPrimary'}`}
                  >
                    {t('logOut')}
                  </Typography>
                )}
              />
            </ListItemButton>
          </List>

          <List
            className="bottom0
              width295-px
              positionAbsolute"
          >
            <Divider variant="middle" className="colorPrimary" />
            <ListItemButton
              className={`borderForNav-7px ${selectedIndex === 5 ? 'primaryBackGround' : 'whiteBackGround'
              }`}
              selected={selectedIndex === 5}
              onClick={(event) => {
                handleListItemClick(event, 5);
              }}
            >
              <ListItemIcon className="minWidth-40px">
                <InfoOutlinedIcon
                  className={`${selectedIndex === 5 ? 'paperColor' : 'colorPrimary'
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primary={(
                  <Typography
                    component="span"
                    className={`fW700
                              fs16
                              ${selectedIndex === 5
                      ? 'paperColor'
                      : 'colorPrimary'
                      }`}
                  >
                    {t('about')}
                  </Typography>
                )}
              />
            </ListItemButton>
          </List>
        </Box>
      </div>
    </SwipeableDrawer>
  );
}

export default SideMenuDrawer;
