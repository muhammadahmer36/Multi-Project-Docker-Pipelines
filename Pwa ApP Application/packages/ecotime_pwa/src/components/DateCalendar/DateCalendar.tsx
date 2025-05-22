import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar as Calendar } from '@mui/x-date-pickers/DateCalendar';
import { DateCalendarProps } from './types';
import renderDay, { slotProps } from './utils';
import styles from './DateCalendar.module.scss';

export default function DateCalendar({
  handleDateChange, handleMonthChange, handleYearChange, highlightedDays, view,
  showDaysOutsideCurrentMonth = true, sx, additionalStyleClass, badgeStyleClass, styledBadgeContentIcon, fixedWeekNumber, value,
}: DateCalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar
        showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
        views={view}
        value={value}
        className={`${additionalStyleClass} ${styles.styledDateCalendarLayout}`}
        sx={sx}
        slots={{
          day: (props) => renderDay({
            ...props, highlightedDays, badgeStyleClass, styledBadgeContentIcon,
          }),
        }}
        fixedWeekNumber={fixedWeekNumber}
        onMonthChange={handleMonthChange}
        onChange={handleDateChange}
        onYearChange={handleYearChange}
        slotProps={slotProps}
      />
    </LocalizationProvider>
  );
}
