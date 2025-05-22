import { SearchConfiguration } from 'pages/TimeOffCalendar/types';
import { Nullable } from 'types/common';
import { ListItem } from 'components/DropDown/types';

export type Permission = string
export interface GeofecingApplicableResponse {
  isGeofencingApplicable: boolean
}

export interface PermissionInitialState {
  permissions: Permission[]
}

export interface AuthenticationTypePayload {
  payload: string;
  type: string;
}

export interface Employee {
  fldId?: number,
  code: string,
  description: string
}

export interface CommonInitialState {
  uniqueId: string,
  searchConfiguration: SearchConfiguration[],
  authenticationTypeId: Nullable<number>,
  employeeList: ListItem[],
  timsheetGroups: ListItem[],
  dropDownListLoader: boolean;
}
export enum Resource {
  // eslint-disable-next-line no-unused-vars
  TimePunches = 290,
  // eslint-disable-next-line no-unused-vars
  TimeOff = 289,
  // eslint-disable-next-line no-unused-vars
  Balances = 288,
  // eslint-disable-next-line no-unused-vars
  Timesheet = 287
}

export enum GeofenceRestriction {
  // eslint-disable-next-line no-unused-vars
  FullRestriction = 1,
  // eslint-disable-next-line no-unused-vars
  Warning = 2,
  // eslint-disable-next-line no-unused-vars
  Allowed = 3,
}

export enum UserRole {
  // eslint-disable-next-line no-unused-vars
  Employee = 1,
  // eslint-disable-next-line no-unused-vars
  Manager = 2,
  // eslint-disable-next-line no-unused-vars
  Both = 3
}

export interface EmployeeListQueryParams {
  resourceId: string;
  searchString: string;
}

export interface EmployeeListPayload {
  payload: EmployeeListQueryParams;
  type: string;
}

export interface TimeSheetGroupPayload {
  payload: string;
  type: string;
}
