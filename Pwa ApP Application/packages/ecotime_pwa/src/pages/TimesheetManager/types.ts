import { ListItem } from 'components/DropDown/types';
import { TimesheetActions } from 'pages/dashboard/types';
import { Nullable } from 'types/common';

export interface EmployeeDetail {
    empNo: string;
    employeeName: string;
    completeStatus_Code: boolean;
    completeStatus_Title: string;
    completeStatus_Color: string;
    approveStatus_Code: boolean;
    approveStatus_Title: string;
    approveStatus_Color: string;
    lockStatus_Code: boolean;
    lockStatus_Title: string;
    lockStatus_Color: string;
    duration_Display: string;
    notesCount: number;
    errorCount: number;
    errorDescription: string;
    actions: string;
}

export interface InitialState {
    employeeDetail: EmployeeDetail[];
    checkedItems: boolean[];
    visibleApprovedConsent: boolean;
    visibleUnApprovedConsent: boolean;
    check: boolean;
    payPeriod: ListItem;
    selectedTimesheet: Nullable<EmployeeDetail>
}
export interface TimesheetActionPayload {
    actionId: TimesheetActions;
    listOfEmployeeNumbers: string;
}
