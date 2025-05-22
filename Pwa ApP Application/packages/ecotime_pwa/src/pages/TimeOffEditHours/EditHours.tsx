import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dayjs, addTimeDurationInDate, convertStringIntoDayJsDate, getCurrentFormattedDate,
  getDateAgainstFormat,
  getHoursFromDate, getMinutesFromDate,
} from 'core/utils';
import {
  Geofencing, DropDown, StyledTextField, TimeOffPageFooter, TimeOffHeader,
} from 'components';
import BottomBar from 'layout/bottomBar/bottomBar';
import Box from '@mui/material/Box';
import {
  formatsMapper, getDayFromDate,
} from 'core/utils';
import { getTimeInDecimal } from 'utilities';
import { monthDayYearFormat, previousPage } from 'appConstants';
import { Resource } from 'common/types/types';
import { getItemDetailOfTimeOffRequestsScreen3, getSummaryOfItemsDetail } from 'pages/TimeOffCalendar/selectors';
import { calculateTotalHoursForFooter, setDetailItemsOfTimeOffRequest, updateItemDetail } from 'pages/TimeOffCalendar/slice';
import { TimeOffRequestItemDetail } from 'pages/TimeOffCalendar/types';
import SwapDuration from './SwapDuration';
import styles from './EditHours.module.scss';

const initialState = {
  selectedDate: {
    code: '',
    description: '',
  },
  primaryDurationHeading: '',
  secondaryDurationHeading: '',
  secondaryPayCodeId: 0,
  primaryDuration: convertStringIntoDayJsDate(getCurrentFormattedDate()),
  secondaryDuration: convertStringIntoDayJsDate(getCurrentFormattedDate()),
};

export interface DateRange {
  code: string;
  description: string;
}

const initialDateRanges: DateRange[] = [];

export default function AddTimeOffStep3() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const summaryOfItemsDetail = useSelector(getSummaryOfItemsDetail);
  const ItemsDetail = useSelector(getItemDetailOfTimeOffRequestsScreen3);
  const [formState, setFormState] = useState(initialState);
  const [timeOffRequestDateRanges, setTimeOffRequestDateRanges] = useState(initialDateRanges);
  const multipleTimeOffRequests = timeOffRequestDateRanges.length >= 2;
  const { startDate: summaryStartDate, endDate: summaryEndDate } = summaryOfItemsDetail;

  const timeOffRequestStartDate = getDateAgainstFormat(summaryStartDate);
  const timeOffRequestEndDate = getDateAgainstFormat(summaryEndDate);

  const { state } = location;
  const { requestDate } = state;

  const getDateRangesForDropDownList = () => {
    const timeOffRequestDates = ItemsDetail.map(({ requestDate }: TimeOffRequestItemDetail) => {
      const date = getDateAgainstFormat(requestDate);
      const day = getDayFromDate(requestDate);
      const dropDownValue = {
        code: date,
        description: `${day}, ${date}`,
      };
      return dropDownValue;
    });

    setTimeOffRequestDateRanges(timeOffRequestDates);
  };

  const setInitialTimeOffRequestAgainstRequestDate = () => {
    const requestDateTimeOffRequest = ItemsDetail
      .find((eachTimeOffRequest: TimeOffRequestItemDetail) => getDateAgainstFormat(eachTimeOffRequest
        .requestDate, formatsMapper[monthDayYearFormat])
        === getDateAgainstFormat(requestDate));

    if (requestDateTimeOffRequest) {
      /* eslint-disable camelcase */
      const {
        payCode1_DisplayValue, payCode2_DisplayValue, payCodeId2, duration1, duration2, requestDate,
      } = requestDateTimeOffRequest;

      const date = getDateAgainstFormat(requestDate);
      const day = getDayFromDate(requestDate);

      const selectedDate = {
        code: date,
        description: `${day}, ${date}`,
      };
      setFormState((prevState) => ({
        ...prevState,
        selectedDate,
        secondaryPayCodeId: payCodeId2,
        primaryDurationHeading: payCode1_DisplayValue,
        secondaryDurationHeading: payCode2_DisplayValue,
        primaryDuration: addTimeDurationInDate(requestDate, 'hour', duration1),
        secondaryDuration: addTimeDurationInDate(requestDate, 'hour', duration2),
      }));
    }
  };

  const updateDurationInItemDetail = (timeInDecimal: number, durationKey: string) => {
    const updatedItemsDetail = ItemsDetail.map((item: TimeOffRequestItemDetail) => {
      const { requestDate } = item;
      const date = getDateAgainstFormat(requestDate);
      if (date === formState.selectedDate.code) {
        return { ...item, [durationKey]: timeInDecimal };
      }
      return item;
    });

    dispatch(updateItemDetail(updatedItemsDetail));
  };

  const savePrimaryDuration = (dateWithTime: Dayjs | null) => {
    const timeInDecimal = getTimeInDecimal(getHoursFromDate(dateWithTime), getMinutesFromDate(dateWithTime));
    updateDurationInItemDetail(timeInDecimal, 'duration1');

    setFormState((prevState) => ({
      ...prevState,
      primaryDuration: convertStringIntoDayJsDate(dateWithTime),
    }));
  };

  const saveSecondaryDuration = (dateWithTime: Dayjs | null) => {
    const timeInDecimal = getTimeInDecimal(getHoursFromDate(dateWithTime), getMinutesFromDate(dateWithTime));

    updateDurationInItemDetail(timeInDecimal, 'duration2');

    setFormState((prevState) => ({
      ...prevState,
      secondaryDuration: convertStringIntoDayJsDate(dateWithTime),
    }));
  };

  const getTimeOffAgainstDate = (date: string) => {
    const timeOffRequest = ItemsDetail
      .filter((eachItem: TimeOffRequestItemDetail) => getDateAgainstFormat(eachItem
        .requestDate) === date);
    return timeOffRequest;
  };

  const handleDateChange = (value: string | undefined) => {
    if (value !== undefined) {
      const timeOffRequest = getTimeOffAgainstDate(value);
      const {
        payCode1_DisplayValue, payCode2_DisplayValue, duration1, duration2, requestDate, payCodeId2,
      } = timeOffRequest[0];
      const selectedDate = {
        code: getDateAgainstFormat(requestDate),
        description: `${getDayFromDate(requestDate)}, ${getDateAgainstFormat(requestDate)}`,
      };
      setFormState((prevState) => ({
        ...prevState,
        selectedDate,
        secondaryPayCodeId: payCodeId2,
        primaryDurationHeading: payCode1_DisplayValue,
        secondaryDurationHeading: payCode2_DisplayValue,
        primaryDuration: addTimeDurationInDate(requestDate, 'hour', duration1),
        secondaryDuration: addTimeDurationInDate(requestDate, 'hour', duration2),
      }));
    }
  };

  const swapCurrentHours = (duration1: Dayjs, duration2: Dayjs) => {
    setFormState((prevState) => ({
      ...prevState,
      primaryDuration: duration2,
      secondaryDuration: duration1,
    }));
  };

  const swapHoursInItemsDetail = (duration1: Dayjs, duration2: Dayjs) => {
    const duration1InDecimal = getTimeInDecimal(getHoursFromDate(duration1), getMinutesFromDate(duration1));
    const duration2InDecimal = getTimeInDecimal(getHoursFromDate(duration2), getMinutesFromDate(duration2));

    const updatedItemsDetail = ItemsDetail.map((item: TimeOffRequestItemDetail) => {
      const date = getDateAgainstFormat(item.requestDate);
      if (date === formState.selectedDate.code) {
        return {
          ...item,
          duration1: duration2InDecimal,
          duration2: duration1InDecimal,
        };
      }
      return item;
    });

    dispatch(updateItemDetail(updatedItemsDetail));
  };

  const handleSwapHours = () => {
    const { primaryDuration, secondaryDuration } = formState;
    swapHoursInItemsDetail(primaryDuration, secondaryDuration);
    swapCurrentHours(primaryDuration, secondaryDuration);
  };

  const applyChanges = () => {
    dispatch(setDetailItemsOfTimeOffRequest(ItemsDetail));
    dispatch(calculateTotalHoursForFooter());
    navigate(previousPage);
  };

  const handleCancelButton = () => {
    navigate(previousPage);
  };

  useEffect(() => {
    getDateRangesForDropDownList();
    setInitialTimeOffRequestAgainstRequestDate();
  }, []);

  return (
    <div className={styles.addTimeOffStep3}>
      <TimeOffHeader formLabel={t('newTimeOffRequests')} />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimeOff} />
      <Geofencing.GeofencingResource resourceId={Resource.TimeOff}>
        <Box
          className={styles.form}
        >
          <StyledTextField
            value={`${timeOffRequestStartDate}-${timeOffRequestEndDate}`}
            label={t('date')}
          />
          <Box
            className={styles.spaceBetweenFields}
          />
          {
            multipleTimeOffRequests
            && (
              <DropDown
                label={t('selectDate')}
                value={formState.selectedDate}
                onChange={handleDateChange}
                list={timeOffRequestDateRanges}
              />
            )
          }

          <SwapDuration
            durationHeading={t('durationWithColon')}
            timePickerLabel={t('selectTime')}
            primaryHourType={formState.primaryDurationHeading}
            secondaryHourType={formState.secondaryDurationHeading}
            hoursText={t('hrs')}
            onChangePrimaryDuration={savePrimaryDuration}
            onChangeSecondaryDuration={saveSecondaryDuration}
            savePrimaryDuration={savePrimaryDuration}
            saveSecondaryDuration={saveSecondaryDuration}
            handleSwapHours={handleSwapHours}
            primaryDuration={formState.primaryDuration}
            secondaryDuration={formState.secondaryDuration}
            secondaryPayCode={formState.secondaryPayCodeId}
          />

          <TimeOffPageFooter
            primaryLabel={t('cancel')}
            secondaryLabel={t('apply')}
            footerClass={styles.footer}
            handleSecondaryButton={applyChanges}
            handlePrimaryButton={handleCancelButton}
            shouldButtonDisable={false}
          />
        </Box>
        <BottomBar />
      </Geofencing.GeofencingResource>
    </div>
  );
}
