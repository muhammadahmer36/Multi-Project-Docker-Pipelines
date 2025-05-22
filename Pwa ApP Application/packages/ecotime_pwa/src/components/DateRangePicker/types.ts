/* eslint-disable no-unused-vars */
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'core/utils';

export interface DateRangeProps {
    label: string;
    calendarsToShow?: 1 | 2 | 3;
    disableFutureDates?: boolean;
    value: [Dayjs | null, Dayjs | null]
    hideCircleOnCurrentDate?: boolean;
    showDaysOutsideCurrentMonth?: boolean;
    autoFocus?: boolean;
    dateFormat?: string;
    maximumSelectableDate?: Dayjs
    minimumSelectableDate?: Dayjs
    errorOnField?: boolean;
    closeDateRangeOnSelection?: boolean;
    handleOkButton?: (dates: DateRange<Dayjs>) => void
    handleDateRange: (dates: DateRange<Dayjs>) => void
}
