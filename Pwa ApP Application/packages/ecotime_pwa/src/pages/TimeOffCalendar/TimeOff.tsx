import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DateCalendar, Geofencing, TimeOffHeader } from 'components';
import {
  Dayjs, convertStringIntoDayJsDate, formatsMapper,
  getDateAgainstFormat, checkDateInDateRanges,
} from 'core/utils';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BottomBar from 'layout/bottomBar/bottomBar';
import {
  heightForSingleTimeOff, timeOffRequestDetail,
  timeOffSearch,
  weeksToShowInDateCalendar, yearMonthDayFormat,
} from 'appConstants';
import { Resource, UserRole } from 'common/types/types';
import TimeOffActions from './TimeOffActions';
import TimeOffRequest from './TimeOffRequest';
import {
  getTimeOffRequests, navigateToSaveTimeOffDetailScreen,
  saveEndDateOfTimeOffRequest, saveSelectedEmployees, saveSelectedTimesheetGroup,
  setListOfReviewStatus,
  setUserCurrentRole,
} from './slice';
import {
  getApprovedTimeOffs, getCurrentMode, getEndDateOfTimeOffRequest,
  getNavigateToSaveTimeOffDetail, getSummaryInformation,
  getUserRole,
} from './selectors';
import { SummaryInformation } from './types';
import styles from './TimeOff.module.scss';

export default function TimeOff() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allTimeOffRequest = useSelector(getSummaryInformation);
  const approvedHolidays = useSelector(getApprovedTimeOffs);
  const openTimeOffRequestDetail = useSelector(getNavigateToSaveTimeOffDetail);
  const timeOffRequestEndDate = useSelector(getEndDateOfTimeOffRequest);
  const userRole = useSelector(getUserRole);
  const userCurrentRole = useSelector(getCurrentMode);
  const [timeRequests, setTimeRequest] = useState<SummaryInformation[]>([]);
  const [selectedDate, setSelectedDate] = useState(timeOffRequestEndDate);

  const handleDateRange = (date: Dayjs) => {
    const getDate = getDateAgainstFormat(date, formatsMapper[yearMonthDayFormat]);
    setSelectedDate(getDate);
    dispatch(getTimeOffRequests({ date: getDate }));
    dispatch(saveEndDateOfTimeOffRequest(getDate));
  };

  const filterTimeOffRequestAgaintDate = (date: Dayjs) => {
    const getDate = getDateAgainstFormat(date, formatsMapper[yearMonthDayFormat]);

    const timeOffRequestOnDate = allTimeOffRequest.filter((item: SummaryInformation) => {
      const startDateInDayJs = convertStringIntoDayJsDate(item.startDate);
      const endDateInDayJs = convertStringIntoDayJsDate(item.endDate);
      const startDate = getDateAgainstFormat(startDateInDayJs, formatsMapper[yearMonthDayFormat]);
      const endDate = getDateAgainstFormat(endDateInDayJs, formatsMapper[yearMonthDayFormat]);
      return checkDateInDateRanges(getDate, startDate, endDate);
    });
    setTimeRequest(timeOffRequestOnDate);
  };

  /* eslint-disable camelcase */
  const renderAllTimeOfRequest = () => (
    <>
      {timeRequests.map(({
        reviewStatus_Title,
        startEndDates_DisplayTitle,
        summedHoursByType_DisplayValue,
        processStatus_DisplayTitle,
        reviewStatus_Code,
        startDate,
        endDate,
        requestId,
        employeeName,
      }) => (
        <TimeOffRequest
          key={requestId}
          processStatus={processStatus_DisplayTitle}
          requestId={requestId}
          reviewStatus={reviewStatus_Title}
          date={startEndDates_DisplayTitle}
          startDate={startDate}
          endDate={endDate}
          reviewStatusCode={reviewStatus_Code}
          reason={summedHoursByType_DisplayValue}
          employeeName={employeeName}
        />
      ))}
    </>
  );

  const handleManagerClick = () => {
    dispatch(setUserCurrentRole(UserRole.Manager));
    dispatch(saveSelectedTimesheetGroup(null));
    dispatch(saveSelectedEmployees([]));
    dispatch(setListOfReviewStatus([]));
    navigate(timeOffSearch);
  };

  const handleEmployeeClick = () => {
    dispatch(setUserCurrentRole(UserRole.Employee));
    dispatch(saveSelectedTimesheetGroup(null));
    const getDate = getDateAgainstFormat(selectedDate, formatsMapper[yearMonthDayFormat]);
    dispatch(getTimeOffRequests({ date: getDate }));
  };

  useEffect(() => {
    if (allTimeOffRequest.length >= 0) {
      setTimeRequest(allTimeOffRequest);
    }
    if (openTimeOffRequestDetail) {
      navigate(timeOffRequestDetail);
      dispatch(navigateToSaveTimeOffDetailScreen(false));
    }
  }, [allTimeOffRequest, openTimeOffRequestDetail]);

  return (
    <div className={styles.timeOff}>
      <TimeOffHeader
        formLabel={t('timeOff')}
        currentUserRole={userCurrentRole}
        userRole={userRole}
        handleClickOnManagerIcon={handleManagerClick}
        handleClickOnEmployeeIcon={handleEmployeeClick}
      />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimeOff} />
      <Geofencing.GeofencingResource resourceId={Resource.TimeOff}>
        <Box
          className={styles.borderBox}
          sx={{
            boxSizing: 'border-box',
          }}
        >
          <DateCalendar
            view={['year', 'month', 'day']}
            value={convertStringIntoDayJsDate(selectedDate)}
            fixedWeekNumber={weeksToShowInDateCalendar}
            highlightedDays={approvedHolidays}
            additionalStyleClass={styles.calendarStyle}
            badgeStyleClass={styles.styledBadge}
            styledBadgeContentIcon={styles.styledBadgeContentIcon}
            handleMonthChange={handleDateRange}
            handleYearChange={handleDateRange}
            handleDateChange={filterTimeOffRequestAgaintDate}
          />
          <Divider
            variant="middle"
            className={styles.divider}
          />
          <Typography
            pl={2}
            pt={0.4}
            className={styles.requestHeading}
          >
            {t('timeOffRequestsColon')}
          </Typography>
          {
            timeRequests.length === 0
            && (
              <Box ml={1.5} mt={1} className={styles.noTimeOffRequest}>
                {t('noTimeOffRequests')}
              </Box>
            )
          }
          <TimeOffActions />
          <div
            style={{
              maxHeight: `calc(100vh - ${heightForSingleTimeOff}px)`,
              overflowY: 'scroll',
            }}
          >
            {renderAllTimeOfRequest()}
          </div>
        </Box>
      </Geofencing.GeofencingResource>
      <BottomBar />
    </div>
  );
}
