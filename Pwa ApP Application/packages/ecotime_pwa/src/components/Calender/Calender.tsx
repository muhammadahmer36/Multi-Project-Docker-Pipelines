import {
  Ref,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { activeColor, primaryColor } from 'appConstants/colors';
import dayjs, { Dayjs } from 'dayjs';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { getDateInDayJSFormat } from 'core/utils';
import styles from './Calender.module.scss';

export interface CalendarProps {
  // eslint-disable-next-line no-unused-vars
  onDateSelect: (date: string) => void;
  dateValue: string | undefined;
  viewMode?: Array<'year' | 'month' | 'day'>;
  calendarLabel: string;
  disabled?: boolean;
  format?: string;
  showDaysOutsideCurrentMonth?: boolean;
}
export interface CalendarRef {
  setClose: () => void;
  setCurrentDateToCalendar: () => void
}

const Calendar = forwardRef(({
  onDateSelect, dateValue, disabled,
  showDaysOutsideCurrentMonth = true,
  calendarLabel, viewMode,
  format,
}: CalendarProps, ref: Ref<CalendarRef>) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(dateValue));
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(dayjs(date));
    if (date != null) {
      onDateSelect(date?.format('MM/DD/YYYY'));
    }
    setOpen(false);
  };

  const commonStyles = {
    sx: {
      color: `${primaryColor}`,
    },
  };
  const onOpen = () => {
    setOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      setClose: () => {
        setOpen(false);
      },
      setCurrentDateToCalendar: () => {
        setSelectedDate(getDateInDayJSFormat());
      },
    }),
    [],
  );

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>

          <DemoItem>
            <DesktopDatePicker
              open={open}
              format={format}
              onOpen={onOpen}
              disabled={disabled}
              views={viewMode}
              showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
              label={calendarLabel}
              className="styledTextField"
              slots={{
                openPickerIcon: DateRangeIcon,
              }}
              slotProps={{
                day: {
                  sx: {
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    color: `${primaryColor}`,
                    '&.MuiPickersDay-root.Mui-selected': {
                      backgroundColor: `${activeColor}`,
                    },
                    '&.MuiPickersMonth-root.Mui-selected': {
                      backgroundColor: `${activeColor}`,
                    },
                    '&.MuiPickersDay-today:not(.Mui-selected)': {
                      border: `1px solid ${primaryColor}`,
                    },
                  },
                },
                desktopPaper: {
                  sx: {
                    color: `${primaryColor}`,
                    '& .MuiPickersYear-yearButton.Mui-selected': {
                      backgroundColor: `${activeColor}!important`,
                    },
                    '& .MuiPickersMonth-monthButton.Mui-selected': {
                      backgroundColor: `${activeColor}!important`,
                    },
                    '& .MuiDayCalendar-weekDayLabel': {
                      color: `${primaryColor}`,
                    },
                  },
                  className: styles.calendarStyle,
                },
                leftArrowIcon: {
                  ...commonStyles,
                },
                rightArrowIcon: {
                  ...commonStyles,
                },
                openPickerIcon: {
                  ...commonStyles,
                },
                switchViewIcon: {
                  ...commonStyles,
                },
                calendarHeader: {
                  ...commonStyles,
                },
              }}
              value={selectedDate}
              onChange={handleDateChange}

            />
          </DemoItem>
        </div>
      </ClickAwayListener>
    </LocalizationProvider>
  );
});

export default Calendar;
