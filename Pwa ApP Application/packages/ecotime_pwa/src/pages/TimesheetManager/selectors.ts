import { RootState } from 'redux/reducer';

export const getEmployeeDetailsList = (state: RootState) => state.timesheetManager.employeeDetail;

export const getCheckedItems = (state: RootState) => state.timesheetManager.checkedItems;

export const getVisibleApprovedConsent = (state: RootState) => state.timesheetManager.visibleApprovedConsent;

export const getVisibleUnApprovedConsent = (state: RootState) => state.timesheetManager.visibleUnApprovedConsent;

export const getCheck = (state: RootState) => state.timesheetManager.check;

export const getSelectedTimesheet = (state: RootState) => state.timesheetManager.selectedTimesheet;

export const getPayPeriod = (state: RootState) => state.timesheetManager.payPeriod;
