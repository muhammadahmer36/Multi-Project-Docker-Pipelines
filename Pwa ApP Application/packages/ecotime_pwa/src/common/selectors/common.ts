import { RootState } from 'redux/reducer';

export const getAuthenticationTypeId = (state: RootState) => state.common.authenticationTypeId;
export const getEmployeeListOfManager = (state: RootState) => state.common.employeeList;
export const getTimesheeGroups = (state: RootState) => state.common.timsheetGroups;
export const getDropDownListLoader = (state: RootState) => state.common.dropDownListLoader;
