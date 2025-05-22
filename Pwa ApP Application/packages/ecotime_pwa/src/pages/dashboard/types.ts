/* eslint-disable no-unused-vars */
import { Nullable } from 'types/common';

export interface DashboardItem {
  resourceId: number;
  title: string;
  description: string;
  commandName: string;
  controllerName: string;
}

interface ResourceInfo {
  resourceId: number;
  resourceTitle: string;
  controllerName: string;
  header: string;
  footer: string;
  employeeNameText: null | string;
  employeeNumber: null | string;
  userCurrentRole: number;
  userRoles: number;
}

export interface ApplicationInfo {
  userEmpNo: string;
  userEmployeeName: string;
  appHeader: string;
  appFooter: string;
  messageCount: number;
  numCharsForAutoComplete: number;
  dateTimeFormat: string;
  dateFormat: string;
  timeFormat: string;
  dateTimeFormatClockWidget: string;
}

export interface Dashboard {
  applicationInfo: ApplicationInfo;
  resourceInfo: ResourceInfo;
  dashboardItems: DashboardItem[];
}

export interface DateTimeFormats {
  dateFormat: string;
  dateTimeFormat: string;
  dateTimeFormatClockWidget: string;
  timeFormat: string;
}

export interface InitialState {
  balances: Nullable<DashboardItem>;
  timePunches: Nullable<DashboardItem>;
  timeOff: Nullable<DashboardItem>;
  timeSheet: Nullable<DashboardItem>;
  appInformation: ApplicationInfo
  timeAndDateInformation: DateTimeFormats
}

export enum ResourceIds {
  Balance = 288,
  TimePunch = 290,
  TimeOff = 289,
  TimeSheet = 287,
}

export enum TimesheetActions {
  Notes = 1002,
  Approved = 1003,
  UnApprove = 1004,
  Certitfy = 1007,
  UnCertitfy = 1008,
  Calculate = 1009,
  CertifyUncertify = 999
}

export interface ITimePunchesAccordionProps {
  isExpanded: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
}
