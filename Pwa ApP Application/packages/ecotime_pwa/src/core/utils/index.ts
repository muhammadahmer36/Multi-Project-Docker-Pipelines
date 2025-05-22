import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { calendarMaximumDate, calendarMinimumDate } from 'appConstants';
import { Nullable } from 'types/common';

import 'dayjs/locale/en';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(isBetween);

const timeZoneMapper: { [key: string]: string } = {
  'Alaska Standard Time': 'AL',
  'Atlantic Standard Time': 'AT',
  'Central Standard Time': 'CT',
  'Eastern Standard Time': 'ET',
  'Hawaii-Aleutian Standard Time': 'HW',
  'Mountain Standard Time': 'MT',
  'Pakistan Standard Time': 'PKT',
  'Pacific Standard Time': 'PT',
};

const BrowserNames: { [key: string]: string } = {
  Edg: 'Microsoft Edge',
  Chrome: 'Google Chrome',
  Firefox: 'Mozilla Firefox',
  Safari: 'Apple Safari',
  Opera: 'Opera',
  UNKNOWN: 'Unknown Browser',
};

export const formatsMapper: { [key: string]: string } = {
  'MM/dd/yyyy': 'dddd, MMMM Do, YYYY',
  'MM/DD/YYYY': 'MM/DD/YYYY',
  'YYYY/MM/DD': 'YYYY/MM/DD',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'hh:mm tt': 'hh:mm',
  'HH:mm': 'HH:mm',
  'HH:mm:ss': 'HH:mm:ss',
  'hh:mm:ss tt': 'hh:mm:ss A',
  'hh:mm A': 'hh:mm A',
};

const dateTimeLabelMapper: { [key: string]: string } = {
  'hh:mm tt': 'hh:mm A',
  'HH:mm': 'HH:mm',
};

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const ensuredUTCFormat = (dateTimeString: string) => {
  if (!dateTimeString.endsWith('Z')) {
    return `${dateTimeString}Z`;
  }
  return dateTimeString;
};

export const convertTimestampToISO = (timestamp: Nullable<number>) => {
  if (timestamp) {
    const isoString = dayjs(timestamp).toISOString();
    return isoString;
  }
  return '';
};

export const convertToTimestamp = (dateTime: string) => dayjs(dateTime).valueOf();

export const getCurrentDateTimeUtC = () => {
  try {
    const localDateTime = dayjs.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return localDateTime;
  } catch (error) {
    return '';
  }
};

export const getCurrentTimeOffset = () => {
  const localTime = dayjs().utcOffset() / 60;
  return localTime;
};

export const convertUtCDateTimeToLocal = (utcDateTime: string): string => {
  try {
    const localDateTime = dayjs.utc(utcDateTime).local().format();
    return localDateTime;
  } catch (error) {
    return '';
  }
};

export const formatTimeToLocale = (utcDateTime: string | number, format = 'HH:mm:ss') => {
  try {
    const mappedFormat = formatsMapper[format];
    const localTime: string = dayjs.utc(utcDateTime).local().format(mappedFormat);
    return localTime;
  } catch (error) {
    return '';
  }
};

export const formatTimeLabelToLocale = (utcDateTime: string | number, format = 'HH:mm:ss') => {
  try {
    const mappedFormat = dateTimeLabelMapper[format];
    const localTime: string = dayjs.utc(utcDateTime).local().format(mappedFormat);
    return localTime;
  } catch (error) {
    return '';
  }
};

export const formatDateToLocale = (dateTime: string | number, format = 'MM/dd/yyyy') => {
  try {
    const mappedFormat = formatsMapper[format];
    const inputDate = dayjs.utc(dateTime).local();
    const dayOfMonth = inputDate.format('D');
    const ordinalSuffix = getOrdinalSuffix(parseInt(dayOfMonth, 10));
    const formattedDate = inputDate.local().format(mappedFormat)
      .replace(/(\d+)o/, (_, match) => `${match}${ordinalSuffix}`);
    return formattedDate;
  } catch (error) {
    return '';
  }
};

export const checkDateInDateRanges = (dateToBeCheck: string, startDate: string, endDate: string) => dayjs(dateToBeCheck)
  .isBetween(startDate, endDate, null, '[]');

export const getTimeZoneAbbreviation = () => {
  const dateString = new Date()?.toString();
  const regex = /\((.*?)\)/g;
  const matches = dateString?.match(regex);

  if (matches && matches.length > 0) {
    const timeZone = matches[0].replace(/\(|\)/g, '').toString();
    const timezoneAbbreviation = timeZoneMapper[timeZone] ? timeZoneMapper[timeZone] : timeZone;
    return timezoneAbbreviation;
  }
  return '';
};

export const getBrowserName = () => {
  const { userAgent } = navigator;
  const browserKey = Object.keys(BrowserNames).find((key) => userAgent.includes(key));
  return browserKey ? BrowserNames[browserKey] : BrowserNames.UNKNOWN;
};

export const getCurrentFormattedDate = () => dayjs.utc().local().format('MM/DD/YYYY');

export const getDateInDayJSFormat = () => dayjs();

export const getDateAgainstFormat = (date: Dayjs | string, format = 'MM/DD/YYYY') => {
  try {
    if (typeof date !== 'string') {
      const dateInStringFormat = date.format(formatsMapper[format]);
      return dateInStringFormat;
    }

    const dateInStringFormat = dayjs(date).format(formatsMapper[format]);
    return dateInStringFormat;
  } catch (error) {
    return '';
  }
};

export const convertStringIntoDayJsDate = (date: string | Dayjs | null) => dayjs(date);

export const getFormattedDuration = (hours: number, minutes: number) => {
  if (hours >= 0 && minutes >= 0) {
    return dayjs.duration({
      minutes,
      hours,
    }).format('HH:mm');
  }
  return '00:00';
};

export const getDateMinusDays = (searchRestriction: number) => dayjs().subtract(searchRestriction, 'day');

export const getDayDifferenceBetweenTwoDates = (startDate: Dayjs, endDate: Dayjs) => {
  const dayDifference = endDate.diff(startDate, 'day');
  return dayDifference;
};

export function getDatesRanges(startDate: string, endDate: string): string[] {
  const datesArray: string[] = [];
  let currentDate = dayjs(startDate);

  while (currentDate <= dayjs(endDate)) {
    datesArray.push(currentDate.format(formatsMapper['MM/DD/YYYY']));
    currentDate = currentDate.add(1, 'day');
  }

  return datesArray;
}

export const getDayFromDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format('dddd');
};

export const getHoursFromDate = (date: Dayjs | null) => dayjs(date).hour();

export const getMinutesFromDate = (date: Dayjs | null) => dayjs(date).minute();

export const addTimeDurationInDate = (date: string, durationType: 'hour' | 'minutes', duration: number) => dayjs(date)
  .add(duration, durationType);

export const toLocaleDateString = (date: string) => {
  try {
    const localDateTime = dayjs(date).toDate().toDateString();
    return localDateTime;
  } catch (error) {
    return '';
  }
};
export { Dayjs };

export const getDailyPickerDate = (dateString: string): string => {
  const date = dayjs(dateString).locale('en').format('dddd, MM/DD/YYYY');
  return date;
};

export const getCurrentDate = (format = 'YYYY-MM-DD'): string => {
  const date = dayjs().format(format);
  return date;
};

export const getLastDateOfSpecificMonth = (month: string) => dayjs(month).endOf('month').format('YYYY-MM-DD');

export const checkDateValidity = (date: string) => dayjs(date).isValid();

export const isDateValidAndWithinRange = (date: string) => {
  const isDateValid = dayjs(date).isValid();
  return isDateValid && dayjs(date).isBetween(calendarMinimumDate, calendarMaximumDate, null, '[]');
};
