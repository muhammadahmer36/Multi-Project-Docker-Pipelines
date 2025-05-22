import { ListItem } from 'components/DropDown/types';
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

export interface DailyDetail {
    weekNum: number;
    tsDate: string;
    timeIn_Display: string;
    timeOut_Display: string;
    timeIn_NextDay: number;
    timeOut_NextDay: number;
    duration_Display: string;
    additionalInfo: string;
    errorsCount: number;
    errorDescription: string;
    doeCode: string;
    doeCode_Title: string;
    task1: number;
    task1_Title: string;
    task2: number;
    task2_Title: string;
    task3: number;
    task3_Title: string;
    task4: number;
    task4_Title: string;
    task5: number;
    task5_Title: string;
    deptChrg: string;
    deptChrg_Title: string;
    quantity: number;
    quantity_Title: string;
    shift: string;
    shift_Title: string;
    positionId: number;
    positionId_Title: string;
    payRate: number;
    payRate_Title: string;
    inOut: boolean;
    timeInDated: string;
    timeOutDated: string;
    hours: number;
    minutes: number;
    duration: number;
    id: number;
}

export interface DailyItem {
    weekNum: number;
    tsDate: string;
    reportedHours: string;
    dailyDetails: DailyDetail[];
}

export interface DailySummary {
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
    dailySummary: DailySummary;
    dailyItems: DailyItem[];
    actions: Action[];
}

export interface InitialState {
    timesheet: Nullable<Timesheet>;
    days: ListItem[]
    day: ListItem,
    dailyDetails: DailyDetail[],
    reportedHours: string,

}

export interface TimesheetListPayload {
    periodIdentity: number,
    employeeNumber?: number
}
