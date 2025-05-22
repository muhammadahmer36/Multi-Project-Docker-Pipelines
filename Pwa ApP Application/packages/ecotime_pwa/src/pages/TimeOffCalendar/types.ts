import { Nullable } from 'types/common';
import { ListItem } from 'components/DropDown/types';
import { NavigateFunction } from 'react-router-dom';

export interface GetTimeOffRequest {
    date?: string;
    page?: string;
    navigate?: NavigateFunction;
}

export interface DetailTimeOffRequestProps extends GetTimeOffRequest {
    requestId: number;
    addTimeOff?: boolean;
    startDate: string;
    endDate: string;
    listOfPayCodes: string | '';
}

export interface TimeOffActionProps {
    calendarDate?: string;
    openDeleteBox?: () => void;
    openManagerActionDialogBox?: () => void;
}

export interface ITimeOffRequest {
    date: string;
    startDate: string;
    endDate: string;
    processStatus: string;
    reviewStatus: string;
    reviewStatusCode: number;
    reason: string;
    requestId: number;
    employeeName: string;
}

export interface GetTimeOffRequestPayload {
    payload: DetailTimeOffRequestProps
    type: string;
}

export interface timeOffAction {
    actionId: number,
    actionTitle: string,
    actionDescription: string,
    alternateTitle: string,
    displayOrder: number,
    displayColor: string
}

export interface SummaryInformation {
    reviewStatus_Title: string;
    processStatusTitle: string;
    requestId: number;
    reviewStatus_Code: number;
    processStatus_DisplayTitle: string;
    summedHoursByType_DisplayValue: string;
    startEndDates_DisplayTitle: string;
    reviewStatus_DisplayTitle: string;
    reviewStatus_Color: string;
    notesExist: boolean;
    processStatus_Title: string;
    totalDays: number;
    totalHours: number;
    startDate: string;
    endDate: string;
    employeeName: string;
    isDeleted: boolean;
    isDenied: boolean;
    isApproved: boolean;
    isPending: boolean;
    isSelectedForManagerAction: boolean;
}

export interface SearchConfiguration {
    displayColor: string;
    search_ReviewStatusCode: string;
}

export interface TimeOffRequestItem {
    displayColor: string;
    search_ReviewStatusCode: string;
}

export interface TimeOffRequestItemDetail {
    requestDate: string;
    readOnly: boolean;
    holiday: boolean;
    maxDailyHours: number,
    payCodeId1: number,
    payCode1_DisplayValue: string;
    duration1: number;
    payCodeId2: number;
    payCode2_DisplayValue: string;
    duration2: number;
    requestDate_DisplayValue: string;
    payCodes_DisplayValue: string;
    duration_DisplayValue: string;
    recordProcessedCode: string;
}

export interface ItemsDetailSummary {
    requestId: number;
    tableTitle: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    totalDays_DisplayTitle: string;
    totalHours: number;
    totalHours_DisplayTitle: string;
    notesCount: number;
    reviewStatus_Code: number;
    reviewStatus_Title: string;
    reviewStatus_DisplayTitle: string;
    reviewStatus_Color: string;
    processStatus_Code: number;
    processStatus_Title: string;
    processStatus_Color: string;
    details_ReadOnly: boolean;
    inputIncrementMins: number;
    processStatusDetails: string;
    resourceInstanceId: number
}

export interface PayCodes {
    code: string;
    description: string;
}

export interface AddTimeOffRequest {
    numberOfPayCodesInput: number;
    requestStatusTitle: string;
    tableTitle: string;
    validationEndDate: string;
    validationMaxDays: number;
    validationMsgDateRange: string;
    validationMsgMaxDays: string;
    validationMsgOverlapping: string;
    validationStartDate: string;
}

export interface SingleRequestInterval {
    startDate: string;
    endDate: string;
}

export interface SelectedHourType {
    code: string;
    description: string;
}

export interface AddTimeOffRequestFormValues {
    startDate: string;
    endDate: string;
    primaryHourType: SelectedHourType;
    secondaryHourType: SelectedHourType;
    notes: string
}

export interface TimeOffRequestNotes {
    enteredByName: string;
    enteredOn: string;
    note: string;
    managerNote: boolean;
    requestId: number;
}

export interface InitialState {
    aprrovedTimeOffRequests: string[]
    timeOffActions: timeOffAction[]
    summaryInfomartion: SummaryInformation[]
    payCodesForDropDownList: PayCodes[]
    detailItemsOfTimeOffRequest: TimeOffRequestItemDetail[]
    detailItemsOfTimeOffRequestScreen3: TimeOffRequestItemDetail[]
    summaryOfDetaiItems: ItemsDetailSummary
    newRequestInfo: AddTimeOffRequest;
    isSuccessfull: boolean
    existingRequestIntervals: SingleRequestInterval[];
    notesDetailOfTimeOffRequest: TimeOffRequestNotes[];
    navigateToSaveTimeffRequest: boolean;
    startEditTimeOffRequest: boolean;
    endDateOfTimeOffRequest: string;
    calendarDateForListView: string;
    addTimeOffFormValues: AddTimeOffRequestFormValues;
    navigateToTimeOffNotesScreen: boolean;
    timeOffRequestId: Nullable<number>;
    listOfReviewStatus: number[];
    listOfEmployee: ListItem[];
    timesheetGroup: Nullable<ListItem>,
    userRole: number;
    currentUserRole: number;
    noteValidationMessage: string;
    saveNoteSuccess: boolean;
    actionIdForManager: number;
    employeeNameOfTimeOfRequest: Nullable<string>;
    datesForNotes: string;
    actionsTimeOffDetail: timeOffAction[],
    actionsTimeOffNotes: timeOffAction[]
}

export interface SaveTimeOffRequest {
    summaryStartDate: string;
    summaryEndDate: string;
    timeOffRequestId: number;
    notes: string | '';
}

export interface TimeOffRequestAction {
    dateOfTimeOfRequests: string;
    requestedIds: string;
    actionId: number;
}

export interface TimeOffRequestsNotes {
    enteredByName: string;
    enteredOn: string;
    managerNote: boolean;
    note: string;
    requestId?: number;
}

export interface NotesProps {
    notesDetail: TimeOffRequestsNotes[]
    currentRole: number;
}

export interface SaveTimeOffRequestPayload {
    payload: SaveTimeOffRequest
    type: string;
}

export interface TimeOffRequestActionPayload {
    payload: TimeOffRequestAction
    type: string;
}

export interface GetTimeOffNotes {
    requestId: string;
    fetcNotesAfterAddingNotes: boolean;
}

export interface GetTimeOffNotesPayload {
    payload: GetTimeOffNotes
    type: string;
}

export interface AddTimeOffNotes {
    timeOffRequestId: number;
    note: string;
    addNotesOnCreateTimeOffRequest?: boolean;
}

export interface AddTimeOffNotesPayload {
    payload: AddTimeOffNotes;
    type: string;
}

/* eslint-disable no-unused-vars */
export enum timeOffActionsButtons {
    add = 2,
    deleteIcon = 3,
    calendarView = 80,
    view = 8,
    search = 26,
    approveEmployeeRequest = 1003,
    denyEmployeeRequest = 1005,
    undoRequest = 1006,
    viewNotes = 1002,
    addNotes = 1001
}

export enum reviewStatus {
    pending = 0,
    approved = 1,
    denied = 2
}

export enum processStatus {
    processed = 'Processed',
    notProcessed = 'Not Processed',
}
