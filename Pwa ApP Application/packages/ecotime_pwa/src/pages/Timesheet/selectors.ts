import { RootState } from 'redux/reducer';

export const getReportedList = (state: RootState) => state.timesheet.reportedList;

export const getCalculatedList = (state: RootState) => state.timesheet.calculatedList;

export const getPayPeriodList = (state: RootState) => state.timesheet.payPeriodList;

export const getPayPeriod = (state: RootState) => state.timesheet.payPeriod;

export const getPayPeriodSummary = (state: RootState) => state.timesheet.payPeriodSummary;

export const getReportedHours = (state: RootState) => state.timesheet.reported;

export const getCalculatedHours = (state: RootState) => state.timesheet.calculated;

export const getVisibleInformationPopup = (state: RootState) => state.timesheet.visibleInformationPopup;

export const getVisibleCertifyPopup = (state: RootState) => state.timesheet.visibleCertifyPopup;

export const getEmployeeInformation = (state: RootState) => state.timesheet.employeeInformation;

export const getSelectedTab = (state: RootState) => state.timesheet.selectedTab;

export const getActions = (state: RootState) => state.timesheet.timesheet.actions;

export const getTimesheetRole = (state: RootState) => state.timesheet.userRole;

export const getTimesheetUserCurrentRole = (state: RootState) => state.timesheet.userCurrentRole;

export const getTimesheetApplicationInfo = (state: RootState) => state.timesheet.applicationInfo;
