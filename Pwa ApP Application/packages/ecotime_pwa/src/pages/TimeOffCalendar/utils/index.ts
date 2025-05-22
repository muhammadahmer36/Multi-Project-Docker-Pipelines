import { durationConvertionInDeciamlForm } from 'utilities';
import { getCurrentFormattedDate } from 'core/utils';
import { zeroDuration } from 'appConstants';
import { TimeOffRequestItemDetail } from 'pages/TimeOffCalendar/types';

export const emptyHourType = { code: '', description: '' };

export const getInitialAddTimeOffFormValues = () => ({
  startDate: getCurrentFormattedDate(),
  endDate: getCurrentFormattedDate(),
  primaryHourType: emptyHourType,
  secondaryHourType: emptyHourType,
  notes: '',
});

export const getDayString = (totalDaysOfTimeOfRequest: string) => {
  if (!totalDaysOfTimeOfRequest) return '';
  const start = totalDaysOfTimeOfRequest.indexOf('(');
  const end = totalDaysOfTimeOfRequest.indexOf(')') + 1;
  return totalDaysOfTimeOfRequest.substring(start, end);
};

export const removeFirsLetterFromString = (text: string) => {
  if (!text) return '';
  const words = text.split(' ');
  const result = words.slice(1).join(' ');
  return result;
};

export const getTotalDaysAndHours = (
  totalHours: number,
  hoursText: string,
  totalDays: string,
) => `${durationConvertionInDeciamlForm(totalHours, 0)}${hoursText} ${getDayString(totalDays)}`;

export const validateMaximumHoursOfAllTimeOfRequests = (timeOffRequests: TimeOffRequestItemDetail[]) => {
  const isWithinMaxDailyHoursLimit = timeOffRequests
    .every(({ duration1, duration2, maxDailyHours }: TimeOffRequestItemDetail) => duration1 + duration2 <= maxDailyHours);
  return isWithinMaxDailyHoursLimit;
};

export const validateZeroHours = (timeOffRequests: TimeOffRequestItemDetail[]) => timeOffRequests
  .every(({ duration1, duration2 }
    : TimeOffRequestItemDetail) => duration1 + duration2 <= zeroDuration);
