import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  timeOff, timeOffList, addTimeOffRequest, timeOffSearch,
} from 'appConstants';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import managerSearch from 'assets/img/managerSearch.svg';
import listView from 'assets/img/timeOffListView.svg';
import calendarIcon from 'assets/img/timeOffCalendar.svg';
import deleteImg from 'assets/img/timeOffDelete.svg';
import addImg from 'assets/img/addIcon.svg';
import managerApproved from 'assets/img/managerApproved.svg';
import managerUnapproved from 'assets/img/managerUnapprove.svg';
import managerUndo from 'assets/img/managerUndo.svg';
import {
  SummaryInformation, TimeOffActionProps, timeOffActionsButtons,
} from 'pages/TimeOffCalendar/types';
import { UserRole } from 'common/types/types';
import { getCurrentMode, getSummaryInformation, getTimeOffActions } from '../selectors';
import { setActionIdForManager } from '../slice';
import useDisabledActionButtons from './hooks/useDisabledActionButtons';
import styles from './TimeOffActions.module.scss';

export default function TimeOffActions(props: TimeOffActionProps) {
  const { calendarDate, openDeleteBox, openManagerActionDialogBox } = props;
  const dispatch = useDispatch();
  const timeOffActions = useSelector(getTimeOffActions) || [];
  const currentRole = useSelector(getCurrentMode);
  const allTimeOffRequest = useSelector(getSummaryInformation);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const {
    add, calendarView, view, deleteIcon,
    search, approveEmployeeRequest, denyEmployeeRequest, undoRequest,
  } = timeOffActionsButtons;

  const navigateToAddTimeOffStep1 = () => {
    navigate(addTimeOffRequest);
  };

  const navigateToTimeOffRequestListView = () => {
    navigate(timeOffList);
  };

  const navigateToTimeOffRequestView = () => {
    navigate(timeOff, {
      state: {
        calendarDate,
      },
    });
  };

  const navigateToTimeOffSearch = () => {
    navigate(timeOffSearch);
  };

  const handleOnClickManagerAction = (actionId: number) => () => {
    dispatch(setActionIdForManager(actionId));
    openManagerActionDialogBox?.();
  };

  const enableDeleteButton = allTimeOffRequest.some((item: SummaryInformation) => item.isDeleted === true);

  const { disabledApproveButton, disabledDeniedButton, disabledUndoButton } = useDisabledActionButtons(allTimeOffRequest);

  return (
    <div className={styles.centerFloatingActions}>
      {timeOffActions.length > 0 && (
        <Box className={styles.floatingContainer} sx={{ '& > :not(style)': { m: '2px 8px' } }}>
          {timeOffActions.map((eachButtonConfiguration: { actionId: number }) => (
            <React.Fragment key={eachButtonConfiguration.actionId}>
              {eachButtonConfiguration.actionId === add && (
                <IconButton
                  className={styles.iconPadding}
                  onClick={navigateToAddTimeOffStep1}
                >
                  <img
                    src={addImg}
                    alt="add"
                  />
                </IconButton>
              )}
              {eachButtonConfiguration.actionId === deleteIcon && pathname !== timeOff && (
                <IconButton
                  className={styles.iconPadding}
                  disabled={!enableDeleteButton}
                  onClick={openDeleteBox}
                >
                  <img
                    src={deleteImg}
                    alt="list"
                    style={{ opacity: !enableDeleteButton ? 0.5 : 1 }}
                  />
                </IconButton>
              )}
              {eachButtonConfiguration.actionId === calendarView && pathname !== timeOffList && (
                <IconButton
                  className={styles.iconPadding}
                  onClick={navigateToTimeOffRequestListView}
                >
                  <img
                    src={listView}
                    alt="list"
                  />
                </IconButton>
              )}
              {eachButtonConfiguration.actionId === view && pathname !== timeOff && (
                <IconButton
                  className={styles.iconPadding}
                  onClick={navigateToTimeOffRequestView}
                >
                  <img
                    src={calendarIcon}
                    alt="calendar"
                  />
                </IconButton>
              )}
              {eachButtonConfiguration.actionId === search && currentRole === UserRole.Manager && (
                <IconButton
                  className={styles.iconPadding}
                  onClick={navigateToTimeOffSearch}
                >
                  <img
                    src={managerSearch}
                    alt="search"
                  />
                </IconButton>
              )}
              {eachButtonConfiguration.actionId === approveEmployeeRequest
                && currentRole === UserRole.Manager && pathname !== timeOff && (
                  <IconButton
                    className={styles.iconPadding}
                    disabled={disabledApproveButton}
                    onClick={handleOnClickManagerAction(approveEmployeeRequest)}
                  >
                    <img
                      src={managerApproved}
                      alt="approve"
                      style={{ opacity: disabledApproveButton ? 0.5 : 1 }}
                    />
                  </IconButton>
              )}
              {eachButtonConfiguration.actionId === denyEmployeeRequest
                && currentRole === UserRole.Manager && pathname !== timeOff && (
                  <IconButton
                    className={styles.iconPadding}
                    disabled={disabledDeniedButton}
                    onClick={handleOnClickManagerAction(denyEmployeeRequest)}
                  >
                    <img
                      src={managerUnapproved}
                      alt="approve"
                      style={{ opacity: disabledDeniedButton ? 0.5 : 1 }}
                    />
                  </IconButton>
              )}
              {eachButtonConfiguration.actionId === undoRequest
                && currentRole === UserRole.Manager && pathname !== timeOff && (
                  <IconButton
                    className={styles.iconPadding}
                    disabled={disabledUndoButton}
                    onClick={handleOnClickManagerAction(undoRequest)}
                  >
                    <img
                      src={managerUndo}
                      alt="undo"
                      style={{ opacity: disabledUndoButton ? 0.5 : 1 }}
                    />
                  </IconButton>
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
    </div>
  );
}
