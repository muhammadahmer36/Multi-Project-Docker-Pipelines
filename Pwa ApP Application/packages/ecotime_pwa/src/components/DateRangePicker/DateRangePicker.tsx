import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker as SingleInputDateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  primaryColor,
} from 'appConstants/colors';
import { formatsMapper } from 'core/utils';
import { DateRangeProps } from './types';
import styles from './DateRangePicker.module.scss';

const commonStyles = {
  sx: {
    color: `${primaryColor}`,
  },
};

export default function DateRangePicker({
  label, calendarsToShow = 1, dateFormat = formatsMapper['MM/DD/YYYY'],
  disableFutureDates = true,
  hideCircleOnCurrentDate = true,
  closeDateRangeOnSelection = true,
  showDaysOutsideCurrentMonth = true,
  autoFocus = false,
  errorOnField,
  minimumSelectableDate,
  maximumSelectableDate,
  handleOkButton,
  value,
  handleDateRange,
}: DateRangeProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <SingleInputDateRangePicker
          className="styledTextField"
          label={label}
          showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
          format={dateFormat}
          disableFuture={disableFutureDates}
          disableHighlightToday={hideCircleOnCurrentDate}
          calendars={calendarsToShow}
          value={value}
          minDate={minimumSelectableDate}
          maxDate={maximumSelectableDate}
          autoFocus={autoFocus}
          slots={{ field: SingleInputDateRangeField }}
          name="allowedRange"
          closeOnSelect={closeDateRangeOnSelection}
          onChange={handleDateRange}
          onAccept={handleOkButton}
          slotProps={{
            textField: {
              InputProps: { endAdornment: <DateRangeIcon /> },
              error: errorOnField,
            },
            actionBar: {
              actions: ['cancel', 'accept'],
            },
            layout: {
              className: styles.styledDateRangeLayout,
            },
            day: {
              sx: {
                zIndex: (theme) => theme.zIndex.drawer + 1,
              },
              className: styles.styledDateRangeDays,
            },
            leftArrowIcon: {
              ...commonStyles,
            },
            rightArrowIcon: {
              ...commonStyles,
            },
            switchViewIcon: {
              ...commonStyles,
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
