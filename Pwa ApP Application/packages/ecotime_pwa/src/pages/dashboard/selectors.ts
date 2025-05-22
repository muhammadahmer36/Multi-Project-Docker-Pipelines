import { RootState } from 'redux/reducer';

export const getBalances = (state: RootState) => state.dashboard.balances;
export const getTimePunches = (state: RootState) => state.dashboard.timePunches;
export const getTimeOff = (state: RootState) => state.dashboard.timeOff;
export const getTimeSheet = (state: RootState) => state.dashboard.timeSheet;
export const getAppInformation = (state: RootState) => state.dashboard.appInformation;
export const getDateAndTimeFormat = (state: RootState) => state.dashboard.timeAndDateInformation;
export const getEmployeeId = (state: RootState) => state.dashboard.appInformation.userEmpNo;
