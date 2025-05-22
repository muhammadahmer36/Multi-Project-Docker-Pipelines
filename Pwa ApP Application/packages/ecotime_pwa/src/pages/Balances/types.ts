/* eslint-disable no-unused-vars */

import { Nullable } from 'types/common';
import { ListItem } from 'components/DropDown/types';
import { NavigateFunction } from 'react-router-dom';

export interface BalanceSummary {
  empNum: string,
  balanceGroupId: number,
  category: string,
  hours: string,
}

export interface GetBalanceCategories {
  date: string,
  page?: string,
  navigate?: NavigateFunction
}

export interface BalanceForTimesheetGroups extends GetBalanceCategories {
  pageid: number;
}

export interface BalanceSummaryForTimesheetGroupPayload {
  type: string,
  payload: BalanceForTimesheetGroups
}

export interface BalanceSummaryPayload {
  type: '',
  payload: GetBalanceCategories
}

export interface HeaderInfo {
  calculatedAsOfDate: string,
  tableTitle: string
}

export interface ResourceInformation {
  employeeNameText: string,
  employeeNumber: string
}

export interface GroupBalance {
  sectionName: string;
  columnName: string;
  balances: BalanceSummary[];
}

export interface GroupedBalanceSummary {
  groupedBalance: GroupBalance;
}

export interface BalanceParams {
  currentEmpNum: string;
  currentEmployeeName: string;
  currentPageId: number;
  employeeCount: number;
  titleMessage: string;
  tsgroupId: string;
}

export interface InitialState {
  listBalanceSummary: BalanceSummary[];
  headerInfo: Nullable<HeaderInfo>;
  balanceDate: string | undefined;
  userCurrentRole: number;
  userRole: number;
  selectedEmployee: Nullable<ListItem>
  groupedBalances: Nullable<GroupedBalanceSummary[]>
  timesheetGroup: Nullable<ListItem>,
  resourceInformation: Nullable<ResourceInformation>,
  balanceParams: Nullable<BalanceParams>,
}

export interface IItemProps {
  value: string,
  isHeading?: boolean,
}
