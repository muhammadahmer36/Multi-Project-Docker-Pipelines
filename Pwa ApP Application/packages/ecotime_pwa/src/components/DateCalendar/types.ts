/* eslint-disable no-unused-vars */
import { Dayjs } from 'core/utils';
import { PickersDayProps } from '@mui/x-date-pickers';

export interface DateCalendarProps {
    value?: Dayjs | null
    hideCircleOnCurrentDate?: boolean;
    fixedWeekNumber?: number;
    handleDateChange: (date: Dayjs) => void
    showDaysOutsideCurrentMonth?: boolean
    handleMonthChange?: (date: Dayjs) => void
    handleYearChange?: (date: Dayjs) => void
    highlightedDays: string[]
    sx?: React.CSSProperties
    view?: Array<'year' | 'month' | 'day'>;
    additionalStyleClass?: string
    badgeStyleClass?: string
    styledBadgeContentIcon?: string
}

export interface RenderDayProps extends PickersDayProps<Dayjs> {
    highlightedDays: string[];
    badgeStyleClass: string | undefined
    styledBadgeContentIcon: string | undefined
}
