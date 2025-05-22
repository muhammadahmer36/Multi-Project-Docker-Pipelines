import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DateRange } from '@mui/x-date-pickers-pro';
import Box from '@mui/material/Box';
import {
  DateRangePicker, Geofencing, DropDown, StyledTextField, TimeOffPageFooter,
} from 'components';
import ApplicationHeader from 'layout/header/header';
import BottomBar from 'layout/bottomBar/bottomBar';
import {
  Dayjs, checkDateInDateRanges, convertStringIntoDayJsDate, formatsMapper,
  getDateAgainstFormat, getDatesRanges, getDayDifferenceBetweenTwoDates,
} from 'core/utils';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import {
  saveTimeOffRequest, previousPage, yearMonthDayFormat, zeroRequestId,
} from 'appConstants';
import { Resource } from 'common/types/types';
import {
  getExistingRequestIntervals, getNewRequestInformation,
  getPayCodesForDropDownList, getNavigateToSaveTimeffRequest, getAddTimeOffRequestFormValues,
} from 'pages/TimeOffCalendar/selectors';
import {
  getDetailOfTimeOffRequests, navigateToSaveTimeffRequest,
  resetAddTimeOfRequestFormValues,
  saveAddTimeOfRequestFormValues, startTimeOffRequest,
} from 'pages/TimeOffCalendar/slice';
import { AddTimeOffRequestFormValues, PayCodes, SingleRequestInterval } from 'pages/TimeOffCalendar/types';
import Header from './Header';
import styles from './AddTimeOffRequest.module.scss';
import { emptyHourType } from '../TimeOffCalendar/utils';

export default function AddTimeOffStep1() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const payCodesForDropDownList = useSelector(getPayCodesForDropDownList);
  const {
    validationMsgDateRange, validationStartDate, validationEndDate,
    validationMaxDays, validationMsgMaxDays, validationMsgOverlapping,
  } = useSelector(getNewRequestInformation);

  const existingTimeOffRequestIntervals = useSelector(getExistingRequestIntervals);
  const openSaveTimeOffRequest = useSelector(getNavigateToSaveTimeffRequest);
  const {
    startDate, endDate, notes, primaryHourType, secondaryHourType,
  } = useSelector(getAddTimeOffRequestFormValues);

  const [value, setValue] = useState<DateRange<Dayjs>>([
    convertStringIntoDayJsDate(startDate),
    convertStringIntoDayJsDate(endDate),
  ]);

  const [formState, setFormState] = useState({
    notes,
    primaryHourType,
    secondaryHourType,
  });

  const handleDateRange = (dates: DateRange<Dayjs>) => {
    setValue(dates);
  };

  const getHourTypeAgainstHourCode = (hourCode: string) => {
    const hourType = payCodesForDropDownList
      .filter((eachItem: PayCodes) => eachItem
        .code === hourCode);
    return hourType;
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      notes: e.target.value,
    }));
  };

  const onCancelButton = (key: string) => {
    setFormState({
      ...formState,
      [key]: emptyHourType,
    });
  };

  const handlePrimaryHoursTypeChange = (value: string | undefined) => {
    if (value !== undefined) {
      const hourType = getHourTypeAgainstHourCode(value);
      setFormState({
        ...formState,
        primaryHourType: hourType[0],
      });
    } else {
      onCancelButton('primaryHourType');
    }
  };

  const handleSecondaryHourTypeChange = (value: string | undefined) => {
    if (value !== undefined) {
      const hourType = getHourTypeAgainstHourCode(value);
      setFormState({
        ...formState,
        secondaryHourType: hourType[0],
      });
    } else {
      onCancelButton('secondaryHourType');
    }
  };

  const checkSelectedDateRangesInExistingIntervals = () => {
    if (value[0] != null && value[1] != null) {
      const dateRanges = getDatesRanges(
        getDateAgainstFormat(value[0]),
        getDateAgainstFormat(value[1]),
      );

      const timeOffRequestOnDate = dateRanges
        .filter((eachDate) => existingTimeOffRequestIntervals
          .some((eachIntervalStartDate: SingleRequestInterval) => {
            const startDate = getDateAgainstFormat(
              convertStringIntoDayJsDate(eachIntervalStartDate.startDate),
              formatsMapper[yearMonthDayFormat],
            );
            const endDate = getDateAgainstFormat(
              convertStringIntoDayJsDate(eachIntervalStartDate.endDate),
              formatsMapper[yearMonthDayFormat],
            );
            return checkDateInDateRanges(eachDate, startDate, endDate);
          }));

      return timeOffRequestOnDate.length >= 1;
    }
    return false;
  };

  const checkSelectedDatesInDateRange = (date: Dayjs) => {
    const selectedStartDate = getDateAgainstFormat(date);
    const minimumSelectableDate = getDateAgainstFormat(convertStringIntoDayJsDate(validationStartDate));
    const maximumSelectableDate = getDateAgainstFormat(convertStringIntoDayJsDate(validationEndDate));
    const isDateValidated = checkDateInDateRanges(selectedStartDate, minimumSelectableDate, maximumSelectableDate);
    return isDateValidated;
  };

  const createTimeOffRequest = () => {
    const { primaryHourType, secondaryHourType, notes } = formState;
    const listOfPayCodes = `${primaryHourType.code || 0}|${secondaryHourType.code || 0}`;
    if (value[0] != null && value[1] != null) {
      const startDate = getDateAgainstFormat(value[0], formatsMapper[yearMonthDayFormat]);
      const endDate = getDateAgainstFormat(value[1], formatsMapper[yearMonthDayFormat]);

      const detailPayload = {
        addTimeOff: true,
        requestId: zeroRequestId,
        listOfPayCodes,
        startDate,
        endDate,
      };

      const formValues: AddTimeOffRequestFormValues = {
        startDate,
        endDate,
        primaryHourType,
        secondaryHourType,
        notes,
      };
      dispatch(saveAddTimeOfRequestFormValues(formValues));
      dispatch(getDetailOfTimeOffRequests(detailPayload));
    }
  };

  const handleNextButton = () => {
    if (value[0] != null && value[1] != null) {
      const dayDifference = getDayDifferenceBetweenTwoDates(value[0], value[1]);
      const validateStartDate = checkSelectedDatesInDateRange(value[0]);
      const validateEndDate = checkSelectedDatesInDateRange(value[1]);
      if (dayDifference >= validationMaxDays) {
        dispatch(openPopup({
          message: validationMsgMaxDays,
          severity: Severity.ERROR,
        }));
      } else if (checkSelectedDateRangesInExistingIntervals()) {
        dispatch(openPopup({
          message: validationMsgOverlapping,
          severity: Severity.ERROR,
        }));
      } else if (!validateStartDate || !validateEndDate) {
        dispatch(openPopup({
          message: validationMsgDateRange,
          severity: Severity.ERROR,
        }));
      } else {
        createTimeOffRequest();
      }
    }
  };

  const handleCancelButton = () => {
    navigate(previousPage);
    dispatch(resetAddTimeOfRequestFormValues());
  };

  const disabledButton = formState.primaryHourType.description === '' && formState.secondaryHourType.description === '';

  useEffect(() => {
    dispatch(startTimeOffRequest());
  }, []);

  useEffect(() => {
    if (openSaveTimeOffRequest) {
      navigate(saveTimeOffRequest);
      dispatch(navigateToSaveTimeffRequest(false));
    }
  }, [openSaveTimeOffRequest]);

  return (
    <div className={styles.addTimeOffStep1}>
      <ApplicationHeader formLabel={t('newTimeOffRequests')} />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimeOff} />
      <Geofencing.GeofencingResource resourceId={Resource.TimeOff}>
        <Box
          className={styles.form}
        >
          <Header heading={validationMsgDateRange} />
          <DateRangePicker
            label={t('Date')}
            value={value}
            errorOnField={false}
            autoFocus
            disableFutureDates={false}
            maximumSelectableDate={convertStringIntoDayJsDate(validationEndDate)}
            minimumSelectableDate={convertStringIntoDayJsDate(validationStartDate)}
            closeDateRangeOnSelection={false}
            handleDateRange={handleDateRange}
          />
          <Box className={styles.spaceBetweenFields} />
          <DropDown
            label={t('hoursTypeWithOutColon')}
            error={false}
            value={formState.secondaryHourType}
            onChange={handleSecondaryHourTypeChange}
            list={payCodesForDropDownList}
          />
          <Box className={styles.spaceBetweenFields} />
          <DropDown
            onChange={handlePrimaryHoursTypeChange}
            label={t('hoursTypeWithOutColon')}
            value={formState.primaryHourType}
            error={false}
            list={payCodesForDropDownList}
          />
          <Box className={styles.spaceBetweenFields} />
          <StyledTextField
            label={t('notes')}
            multiline
            rows={2}
            value={formState.notes}
            onChange={handleOnChange}
          />
          <TimeOffPageFooter
            primaryLabel={t('cancel')}
            secondaryLabel={t('next')}
            footerClass={styles.footer}
            handleSecondaryButton={handleNextButton}
            handlePrimaryButton={handleCancelButton}
            shouldButtonDisable={disabledButton}
          />
        </Box>
      </Geofencing.GeofencingResource>
      <BottomBar />
    </div>
  );
}
