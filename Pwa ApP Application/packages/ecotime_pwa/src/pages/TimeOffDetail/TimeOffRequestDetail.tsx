import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  EmployeeInformation, TimeOffHeader,
  Geofencing, ReactWindowList, StyledTextField, TimeOffPageFooter,
} from 'components';
import Box from '@mui/material/Box';
import BottomBar from 'layout/bottomBar/bottomBar';
import { getDateAgainstFormat } from 'core/utils';
import {
  heightForAddTimeOffDetailGridContainer, heightForTimeOffDetailGridContainer,
  heightForTimeOffNotesContainerForManager, previousPage,
  timeOffNotes,
} from 'appConstants';
import { Resource, UserRole } from 'common/types/types';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import {
  getCurrentMode,
  getEmployeeNameForManagerNoteView,
  getItemDetailOfTimeOffRequests,
  getNavigateToTimeOffNotes,
  getSummaryOfItemsDetail,
  getUserRole,
} from 'pages/TimeOffCalendar/selectors';
import { reviewStatus as reviewStatusEnum } from 'pages/TimeOffCalendar/types';
import {
  getTimeOffNotes,
  navigateToNotesScreen,
  saveDatesForNotes,
  saveNotesDetailOfTimeOffRequest,
  saveTimeOffRequest, saveTimeOffRequestId, setDetailItemsOfTimeOffRequest, updateItemDetail,
} from 'pages/TimeOffCalendar/slice';
import { validateMaximumHoursOfAllTimeOfRequests, validateZeroHours } from 'pages/TimeOffCalendar/utils';
import Footer from './Footer';
import DetailHeader from './Header';
import Item from './Item';
import styles from './TimeOffRequestDetail.module.scss';

export default function TimeOffRequestDetail() {
  const hideRoleIcon = true;
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ItemsDetail = useSelector(getItemDetailOfTimeOffRequests);
  const summaryOfItemsDetail = useSelector(getSummaryOfItemsDetail);
  const openTimeOffNotes = useSelector(getNavigateToTimeOffNotes);
  const employeeName = useSelector(getEmployeeNameForManagerNoteView);
  const currentUserMode = useSelector(getCurrentMode);
  const userRole = useSelector(getUserRole);
  /* eslint-disable camelcase */
  const {
    startDate: summaryStartDate, endDate: summaryEndDate, reviewStatus_Code, requestId,
  } = summaryOfItemsDetail ?? {};

  const timeOffRequestStartDate = getDateAgainstFormat(summaryStartDate);
  const timeOffRequestEndDate = getDateAgainstFormat(summaryEndDate);
  const { pending } = reviewStatusEnum;
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(ItemsDetail.length).fill(false));

  const getListBoxClass = () => {
    let listBoxHeightClass;
    if (currentUserMode === UserRole.Manager) {
      listBoxHeightClass = styles.listBoxHeightForManagerView;
    } else if (reviewStatus_Code === pending) {
      listBoxHeightClass = styles.listBoxHeightForEdit;
    } else {
      listBoxHeightClass = styles.listBoxHeightForDetailView;
    }
    return listBoxHeightClass;
  };

  const getGridContainerHeight = () => {
    let gridHeightForContainer;
    if (currentUserMode === UserRole.Manager) {
      gridHeightForContainer = heightForTimeOffNotesContainerForManager;
    } else if (reviewStatus_Code === pending) {
      gridHeightForContainer = heightForAddTimeOffDetailGridContainer;
    } else {
      gridHeightForContainer = heightForTimeOffDetailGridContainer;
    }
    return gridHeightForContainer;
  };

  const listBoxHeight = getListBoxClass();
  const gridHeight = getGridContainerHeight();

  const onExpandAll = () => {
    setExpandedItems(new Array(ItemsDetail.length).fill(true));
  };

  const onCollapseAll = () => {
    setExpandedItems(new Array(ItemsDetail.length).fill(false));
  };

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = ItemsDetail[index];
    return (
      <div key={index} style={{ ...style }}>
        <Item
          item={item}
          lastRow={ItemsDetail.length - 1 === index}
          index={index}
        />
      </div>
    );
  };

  const handleSaveButton = () => {
    if (!validateMaximumHoursOfAllTimeOfRequests(ItemsDetail)) {
      dispatch(openPopup({
        message: t('maximumHoursValidation'),
        severity: Severity.ERROR,
      }));
      return;
    }
    if (validateZeroHours(ItemsDetail)) {
      dispatch(openPopup({
        message: t('zeroHoursValidation'),
        severity: Severity.ERROR,
      }));
      return;
    }
    const datesForTimeOffRequest = {
      summaryStartDate,
      summaryEndDate,
      timeOffRequestId: requestId,
      notes: '',
    };
    dispatch(saveTimeOffRequest(datesForTimeOffRequest));
  };

  const handleOnNotesIconClick = () => {
    const dateRange = `${timeOffRequestStartDate}-${timeOffRequestEndDate}`;
    const getNotesPayload = {
      requestId: requestId.toString(),
      fetcNotesAfterAddingNotes: false,
    };
    dispatch(saveDatesForNotes(dateRange));
    dispatch(saveNotesDetailOfTimeOffRequest([]));
    dispatch(saveTimeOffRequestId(requestId));
    dispatch(getTimeOffNotes(getNotesPayload));
  };

  const handlePreviousClick = () => {
    navigate(previousPage);
    dispatch(setDetailItemsOfTimeOffRequest([]));
    dispatch(updateItemDetail([]));
  };

  useEffect(() => {
    if (openTimeOffNotes) {
      navigate(timeOffNotes);
      dispatch(navigateToNotesScreen(false));
    }
  }, [openTimeOffNotes]);

  return (
    <div>
      <TimeOffHeader
        hideRoleIcon={hideRoleIcon}
        userRole={userRole}
        currentUserRole={currentUserMode}
        formLabel={t('timeOffRequests')}
      />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimeOff} />
      <Geofencing.GeofencingResource resourceId={Resource.TimeOff}>
        {
          currentUserMode === UserRole.Manager
          && (
            <EmployeeInformation
              employeeName={employeeName}
            />
          )
        }

        <Box mt={2} mb={2} ml={2} mr={2}>
          <StyledTextField
            value={`${timeOffRequestStartDate}-${timeOffRequestEndDate}`}
            label={t('date')}
          />
        </Box>
        <Box mt={2} ml={2} mr={2}>
          <div
            className={styles.gridContainer}
            style={{
              boxSizing: 'border-box',
              height: `calc(100vh - ${gridHeight}px)`,
            }}
          >
            <DetailHeader
              onExpand={onExpandAll}
              onCollapse={onCollapseAll}
              expandedItems={expandedItems}
            />
            <Box
              className={`${listBoxHeight} ${styles.listBox}`}
            >
              {
                ItemsDetail.length > 0 && (
                  <ReactWindowList
                    setExpandedItems={setExpandedItems}
                    expandedItems={expandedItems}
                    data={ItemsDetail}
                    rowRenderer={rowRenderer}
                  />
                )
              }
            </Box>
            <Footer
              handleOnNotesIconClick={handleOnNotesIconClick}
            />
          </div>
          {
            (reviewStatus_Code === pending && currentUserMode === UserRole.Employee) && (
              <TimeOffPageFooter
                primaryLabel={t('cancel')}
                secondaryLabel={t('save')}
                footerClass={styles.footer}
                handleSecondaryButton={handleSaveButton}
                handlePrimaryButton={handlePreviousClick}
                shouldButtonDisable={false}
              />
            )
          }
        </Box>
        <BottomBar />
      </Geofencing.GeofencingResource>
    </div>
  );
}
