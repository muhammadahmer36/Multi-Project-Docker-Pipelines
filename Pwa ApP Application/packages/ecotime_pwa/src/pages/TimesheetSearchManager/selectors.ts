import { RootState } from 'redux/reducer';

export const getPayPeriodList = (state: RootState) => state.timesheetSearchManager.payPeriodList;

export const getPayPeriod = (state: RootState) => state.timesheetSearchManager.payPeriod;

export const getTimehseetGroupList = (state: RootState) => state.timesheetSearchManager.timehseetGroupList;

export const getTimehseetGroup = (state: RootState) => state.timesheetSearchManager.timehseetGroup;

export const getEmployeeList = (state: RootState) => state.timesheetSearchManager.employeeList;

export const getSearchStatusList = (state: RootState) => state.timesheetSearchManager.SearchStatus;

export const getSelectedSearchStatusList = (state: RootState) => state.timesheetSearchManager.selectedSearchStatus;

export const getSelectedEmployeeGroup = (state: RootState) => state.timesheetSearchManager.selectedEmployeeGroup;

export const getSelectedEmployeeList = (state: RootState) => state.timesheetSearchManager.selectedEmployeeList;

export const getPayPeriodDefault = (state: RootState) => state.timesheetSearchManager.payPeriodDefault;
