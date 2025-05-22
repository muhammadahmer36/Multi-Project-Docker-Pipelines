import { NavigateFunction } from 'react-router-dom';
import { Nullable } from 'types/common';

export interface TimesheetAddNotes {
    note: string;
    periodIdentity: string;
}

export interface GetTimesheetNotes {
    code: string;
    navigate?: NavigateFunction;
}

export interface AddTimesheetNotesPayload {
    type: string;
    payload: TimesheetAddNotes;
}

export interface TimesheetNotes {
    empNum: string;
    periodIdentity: number;
    enteredByName: string;
    enteredOn: string;
    note: string;
    managerNote: boolean;
}
export interface GetTimesheetNotesPayload {
    type: string;
    payload: GetTimesheetNotes;
}
export interface InitialState {
    timesheetNotesDetail: TimesheetNotes[];
    noteValidationMessage: string;
    saveNoteSuccess: boolean;
    employeeNameOfSelectedPayPeriod: Nullable<string>;
}
