import { ListItem } from 'components/DropDown/types';
import { TimesheetActions } from 'pages/dashboard/types';
import { Nullable } from 'types/common';

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

export interface ResourceInfo {
    resourceId: number;
    resourceTitle: string;
    controllerName: string;
    header: string;
    footer: string;
    employeeNameText: string;
    employeeNumber: string;
    userCurrentRole: number;
    userRoles: number;
    tsNum: number;
    tsOption: number;
    tsDurationOnly: boolean;
}

export interface PayPeriodSummary {
    periodIdentity: number;
    tableTitle: string;
    payPeriodStartDate: string;
    payPeriodEndDate: string;
    payFrequency: string;
    completeStatus_Code: boolean;
    completeStatus_Title: string;
    completeStatus_Color: string;
    approveStatus_Code: boolean;
    approveStatus_Title: string;
    approveStatus_Color: string;
    lockStatus_Code: boolean;
    lockStatus_Title: string;
    lockStatus_Color: string;
    timesheet_ReadOnly: boolean;
    notesCount: number;
    certifyMessage: string;
    resourceInstanceId: number;
}

export interface TimesheetInputData {
    weekNum: number;
    weekStartDate: string;
    weekEndDate: string;
    tsDate: string;
    groupTitle: string;
    payCodeName: string;
    duration: string;
    errorExists: boolean;
    errorDescription: string;
}

export interface TimesheetCalculatedData {
    weekNum: number;
    weekStartDate: string;
    weekEndDate: string;
    tsDate: string;
    groupTitle: string;
    payCodeName: string;
    duration: string;
}

export interface Week {
    weekNum: number;
    weekStartDate: string;
    weekEndDate: string;
    week_Title: string;
}

export interface Action {
    actionId: number;
    actionTitle: string;
    actionDescription: string;
    alternateTitle: string;
    displayOrder: number;
    displayColor: string;
    viewType: number;
}

export interface Timesheet {
    applicationInfo: ApplicationInfo;
    resourceInfo: ResourceInfo;
    payPeriodSummary: PayPeriodSummary;
    timesheetInputData: TimesheetInputData[];
    timesheetCalculatedData: TimesheetCalculatedData[];
    weeks: Week[];
    actions: Action[];
}

export interface Reported {
    weekNum: number
    payCodeNameList: TimesheetInputData[],
    duration: number,
    errorExists?: boolean;
    errorDescription?: string;
    groupTitle: string,
}

export interface Calculated {
    weekNum: number
    payCodeNameList: TimesheetCalculatedData[],
    duration: number,
    groupTitle: string,
}

export interface InitialState {
    weeks: Week[]
    timesheet: Nullable<Timesheet>;
    reportedList: Reported[],
    calculatedList: Calculated[]
    weekList: ListItem[]
    week: Nullable<ListItem>
    payPeriodSummary: Nullable<PayPeriodSummary>
    reported: number,
    calculated: number,
    visibleInformationPopup: boolean;
    visibleCertifyPopup: boolean;
    employeeInformation: string[],
    groupTitle: string;
}

export interface TimesheetListPayload {
    periodIdentity: number,
    employeeNumber?: number
}

export interface TimesheetActionParams {
    resourceId: number;
    actionId: TimesheetActions;
    periodIdentity: number;
    listOfEmployeeNumbers: string;
    separator: string | null; // Assuming Separator can be a string or null
}

export interface TimesheetActionPayload {
    actionId: TimesheetActions;
}
