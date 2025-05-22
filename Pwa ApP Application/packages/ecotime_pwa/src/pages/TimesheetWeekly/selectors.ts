import { RootState } from 'redux/reducer';

export const getTimeSheetDailyList = (state: RootState) => state.timesheetWeekly.reportedList;

export const getCalculatedList = (state: RootState) => state.timesheetWeekly.calculatedList;

export const getWeekList = (state: RootState) => state.timesheetWeekly.weekList;

export const getWeek = (state: RootState) => state.timesheetWeekly.week;

export const getPayPeriodSummary = (state: RootState) => state.timesheetWeekly.payPeriodSummary;

export const getReportedHours = (state: RootState) => state.timesheetWeekly.reported;

export const getCalculatedHours = (state: RootState) => state.timesheetWeekly.calculated;

export const getVisibleInformationPopup = (state: RootState) => state.timesheetWeekly.visibleInformationPopup;

export const getVisibleCertifyPopup = (state: RootState) => state.timesheetWeekly.visibleCertifyPopup;

export const getEmployeeInformation = (state: RootState) => state.timesheetWeekly.employeeInformation;

export const getTimesheet = (state: RootState) => state.timesheetWeekly.timesheet;

export const getWeeks = (state: RootState) => state.timesheetWeekly.weeks;

export const getGroupTitle = (state: RootState) => state.timesheetWeekly.groupTitle;
