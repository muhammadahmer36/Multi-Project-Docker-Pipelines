import { RootState } from 'redux/reducer';

export const getDay = (state: RootState) => state.timesheetDaily.day;

export const getDays = (state: RootState) => state.timesheetDaily.days;

export const getReportedHours = (state: RootState) => state.timesheetDaily.reportedHours;

export const getDailyDetailsList = (state: RootState) => state.timesheetDaily.dailyDetails;

export const getTimesheetDaily = (state: RootState) => state.timesheetDaily.timesheet;
