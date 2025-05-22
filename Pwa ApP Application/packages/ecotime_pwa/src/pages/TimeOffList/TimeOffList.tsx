import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Calender, Geofencing, ReactWindowList, TimeOffHeader,
} from 'components';
import { CalendarRef } from 'components/Calender/Calender';
import Box from '@mui/material/Box';
import BottomBar from 'layout/bottomBar/bottomBar';
import {
  formatsMapper,
  getDateAgainstFormat,
} from 'core/utils';
import {
  heightForTimeOffDetailGridContainer, timeOffRequestDetail, yearMonthDayFormat,
  timeOffNotes,
} from 'appConstants';
import { Resource, UserRole } from 'common/types/types';
import {
  getTimeOffRequests, setSummaryInformation,
  navigateToSaveTimeOffDetailScreen, navigateToNotesScreen,
  setUserCurrentRole,
  saveEndDateOfTimeOffRequest,
  timeOffRequestAction,
} from 'pages/TimeOffCalendar/slice';
import {
  getCurrentMode,
  getEndDateOfTimeOffRequest,
  getNavigateToSaveTimeOffDetail,
  getNavigateToTimeOffNotes,
  getSelectedActionForManager,
  getSummaryInformation,
  getUserRole,
} from 'pages/TimeOffCalendar/selectors';
import TimeOffActions from 'pages/TimeOffCalendar/TimeOffActions';
import Item from './Item';
import DeleteDialogBox from './DeleteDialogBox';
import ManagerActionDialogBox from './ManagerActionDialogBox';
import ListHeader from './Header';
import { SummaryInformation, timeOffActionsButtons } from '../TimeOffCalendar/types';
import styles from './TimeOffList.module.scss';

export default function TimeOffList() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const calendarRef = useRef<CalendarRef>(null);
  const openTimeOffRequestDetail = useSelector(getNavigateToSaveTimeOffDetail);
  const openTimeOffNotes = useSelector(getNavigateToTimeOffNotes);
  const dateForCalendar = useSelector(getEndDateOfTimeOffRequest);
  const userRole = useSelector(getUserRole);
  const allTimeOffRequest = useSelector(getSummaryInformation);
  const selectedActionId = useSelector(getSelectedActionForManager);
  const userCurrentRole = useSelector(getCurrentMode);
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(allTimeOffRequest.length).fill(false));
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [openManagerActionDialogBox, setOpenManagerActionDialogBox] = useState(false);
  const formLabel = userRole !== UserRole.Employee ? t('timeOff') : t('timeOffRequestsList');
  const hideRoleIcon = true;

  const {
    deleteIcon,
  } = timeOffActionsButtons;

  const handleDateSelect = (date: string) => {
    const convertedDate = getDateAgainstFormat(date, formatsMapper[yearMonthDayFormat]);
    dispatch(setSummaryInformation([]));
    dispatch(getTimeOffRequests({ date: convertedDate }));
    dispatch(saveEndDateOfTimeOffRequest(convertedDate));
  };

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = allTimeOffRequest[index];
    return (
      <div key={index} style={style}>
        <Item
          item={item}
          lastRow={allTimeOffRequest.length - 1 === index}
          index={index}
        />
      </div>
    );
  };

  const closeDialog = () => {
    setOpenDialogBox(false);
  };

  const openManagerActionDialog = () => {
    setOpenManagerActionDialogBox(true);
  };

  const closeManagerActionDialog = () => {
    setOpenManagerActionDialogBox(false);
  };

  const openDialog = () => {
    setOpenDialogBox(true);
  };

  /* eslint-disable no-unused-vars */
  const getRequestIdsOfTimeOfRequests = (filterFunction: (item: SummaryInformation) => boolean) => {
    const idsWithPipe = allTimeOffRequest
      .filter(filterFunction)
      .map((item: SummaryInformation) => item.requestId)
      .join('|');
    return idsWithPipe;
  };

  const deleteTimeOfRequests = () => {
    const requestIdsOfDeleteTimeOfRequests = getRequestIdsOfTimeOfRequests((item) => item.isDeleted);
    const deletePayload = {
      dateOfTimeOfRequests: dateForCalendar,
      requestedIds: requestIdsOfDeleteTimeOfRequests,
      actionId: deleteIcon,
    };
    dispatch(timeOffRequestAction(deletePayload));
    setOpenDialogBox(false);
  };

  const handleManagerAction = () => {
    const requestIdsOfActions = getRequestIdsOfTimeOfRequests((item) => item.isSelectedForManagerAction);
    const ManagerActionPayload = {
      dateOfTimeOfRequests: dateForCalendar,
      requestedIds: requestIdsOfActions,
      actionId: selectedActionId,
    };
    dispatch(timeOffRequestAction(ManagerActionPayload));
    closeManagerActionDialog();
  };

  const getTimeOffRequestList = () => {
    const date = getDateAgainstFormat(dateForCalendar, formatsMapper[yearMonthDayFormat]);
    dispatch(saveEndDateOfTimeOffRequest(date));
    dispatch(getTimeOffRequests({ date }));
  };

  const handleEmployeeClick = () => {
    dispatch(setUserCurrentRole(UserRole.Employee));
    getTimeOffRequestList();
  };

  const handleManagerClick = () => {
    dispatch(setUserCurrentRole(UserRole.Manager));
    getTimeOffRequestList();
  };

  useEffect(() => {
    if (openTimeOffRequestDetail) {
      navigate(timeOffRequestDetail);
      dispatch(navigateToSaveTimeOffDetailScreen(false));
    }
  }, [openTimeOffRequestDetail]);

  useEffect(() => {
    if (openTimeOffNotes) {
      navigate(timeOffNotes);
      dispatch(navigateToNotesScreen(false));
    }
  }, [openTimeOffNotes]);

  return (
    <div>
      <DeleteDialogBox
        deleteTimeOfRequests={deleteTimeOfRequests}
        openDialogBox={openDialogBox}
        closeDialog={closeDialog}
      />

      <ManagerActionDialogBox
        deleteTimeOfRequests={handleManagerAction}
        openDialogBox={openManagerActionDialogBox}
        closeDialog={closeManagerActionDialog}
      />

      <TimeOffHeader
        hideRoleIcon={hideRoleIcon}
        userRole={userRole}
        currentUserRole={userCurrentRole}
        handleClickOnEmployeeIcon={handleEmployeeClick}
        handleClickOnManagerIcon={handleManagerClick}
        formLabel={formLabel}
      />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimeOff} />
      <Geofencing.GeofencingResource resourceId={Resource.TimeOff}>
        <Box mt={3} mb={0} ml={2} mr={2}>
          <Calender
            viewMode={['year', 'month']}
            dateValue={dateForCalendar}
            ref={calendarRef}
            calendarLabel={t('month')}
            onDateSelect={handleDateSelect}
          />
        </Box>
        <Box mt={1} ml={2} mr={2}>
          <div
            className={styles.gridContainer}
            style={{
              boxSizing: 'border-box',
              height: `calc(100vh - ${heightForTimeOffDetailGridContainer}px)`,
            }}
          >
            <ListHeader />
            <Box
              className={styles.listBox}
            >
              {
                allTimeOffRequest.length > 0 && (
                  <ReactWindowList
                    setExpandedItems={setExpandedItems}
                    expandedItems={expandedItems}
                    data={allTimeOffRequest}
                    rowRenderer={rowRenderer}
                  />
                )
              }
            </Box>
          </div>
        </Box>
        <TimeOffActions
          openDeleteBox={openDialog}
          openManagerActionDialogBox={openManagerActionDialog}
        />
        <BottomBar />
      </Geofencing.GeofencingResource>
    </div>
  );
}
