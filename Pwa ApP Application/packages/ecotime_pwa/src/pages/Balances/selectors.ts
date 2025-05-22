import { RootState } from 'redux/reducer';

export const getBalanceSummary = (state: RootState) => state.Balances.listBalanceSummary;

export const getHeaderInfo = (state: RootState) => state.Balances.headerInfo;

export const getBalanceDate = (state: RootState) => state.Balances.balanceDate;

export const getBalanceRole = (state: RootState) => state.Balances.userRole;

export const getBalanceUserCurrentRole = (state: RootState) => state.Balances.userCurrentRole;

export const getSelectedEmployee = (state: RootState) => state.Balances.selectedEmployee;

export const getBalanceGroupes = (state: RootState) => state.Balances.groupedBalances;

export const getSelectedTimesheetGroup = (state: RootState) => state.Balances.timesheetGroup;

export const getResourceInformation = (state: RootState) => state.Balances.resourceInformation;

export const getBalanceParams = (state: RootState) => state.Balances.balanceParams;
