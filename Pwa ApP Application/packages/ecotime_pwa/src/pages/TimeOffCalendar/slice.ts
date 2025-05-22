import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { getCurrentFormattedDate } from 'core/utils';
import { getInitialAddTimeOffFormValues } from 'pages/TimeOffCalendar/utils';
import { Nullable } from 'types/common';
import { UserRole } from 'common/types/types';
import { ListItem } from 'components/DropDown/types';
import {
  InitialState,
  TimeOffRequestItemDetail,
  SummaryInformation,
  timeOffAction,
  ItemsDetailSummary,
  DetailTimeOffRequestProps,
  PayCodes,
  AddTimeOffRequest,
  SingleRequestInterval,
  SaveTimeOffRequest,
  AddTimeOffRequestFormValues,
  TimeOffRequestNotes,
  AddTimeOffNotes,
  GetTimeOffNotes,
  TimeOffRequestAction,
  GetTimeOffRequest,
} from './types';

const initialState: InitialState = {
  aprrovedTimeOffRequests: [],
  timeOffActions: [],
  summaryInfomartion: [],
  detailItemsOfTimeOffRequest: [],
  detailItemsOfTimeOffRequestScreen3: [],
  existingRequestIntervals: [],
  isSuccessfull: false,
  summaryOfDetaiItems: {
    requestId: 0,
    tableTitle: '',
    startDate: getCurrentFormattedDate(),
    endDate: getCurrentFormattedDate(),
    totalDays: 0,
    totalDays_DisplayTitle: '',
    totalHours: 0,
    totalHours_DisplayTitle: '',
    notesCount: 0,
    reviewStatus_Code: 0,
    reviewStatus_Title: '',
    reviewStatus_DisplayTitle: '',
    reviewStatus_Color: '',
    processStatus_Code: 0,
    processStatus_Title: '',
    processStatus_Color: '',
    details_ReadOnly: false,
    inputIncrementMins: 0,
    processStatusDetails: '',
    resourceInstanceId: 0,
  },
  payCodesForDropDownList: [],
  newRequestInfo: {
    numberOfPayCodesInput: 0,
    requestStatusTitle: '',
    tableTitle: '',
    validationEndDate: '',
    validationMaxDays: 0,
    validationMsgDateRange: '',
    validationMsgMaxDays: '',
    validationMsgOverlapping: '',
    validationStartDate: '',
  },
  navigateToSaveTimeffRequest: false,
  endDateOfTimeOffRequest: '',
  startEditTimeOffRequest: false,
  addTimeOffFormValues: getInitialAddTimeOffFormValues(),
  calendarDateForListView: getCurrentFormattedDate(),
  notesDetailOfTimeOffRequest: [],
  navigateToTimeOffNotesScreen: false,
  timeOffRequestId: null,
  listOfReviewStatus: [],
  listOfEmployee: [],
  userRole: UserRole.Employee,
  currentUserRole: UserRole.Employee,
  noteValidationMessage: '',
  saveNoteSuccess: false,
  actionIdForManager: 0,
  timesheetGroup: null,
  employeeNameOfTimeOfRequest: null,
  datesForNotes: '',
  actionsTimeOffDetail: [],
  actionsTimeOffNotes: [],
};

const timeOffSlice = createSlice({
  name: 'timeOff',
  initialState,
  reducers: {
    setApprovedHolidays: (state, action: PayloadAction<string[]>) => {
      state.aprrovedTimeOffRequests = action.payload;
    },
    setSummaryInformation: (state, action: PayloadAction<SummaryInformation[]>) => {
      state.summaryInfomartion = action.payload;
    },
    setTimeOffActions: (state, action: PayloadAction<timeOffAction[]>) => {
      state.timeOffActions = action.payload;
    },
    setDetailItemsOfTimeOffRequest:
      (state, action: PayloadAction<TimeOffRequestItemDetail[]>) => {
        state.detailItemsOfTimeOffRequest = action.payload;
      },
    setSummaryOfDetailItems: (state, action: PayloadAction<ItemsDetailSummary>) => {
      state.summaryOfDetaiItems = action.payload;
    },
    setPayCodesForDropDownList: (state, action: PayloadAction<PayCodes[]>) => {
      state.payCodesForDropDownList = action.payload;
    },
    setNewResquestInformation: (state, action: PayloadAction<AddTimeOffRequest>) => {
      state.newRequestInfo = action.payload;
    },
    setExistingRequestIntervals: (state, action: PayloadAction<SingleRequestInterval[]>) => {
      state.existingRequestIntervals = action.payload;
    },
    successSaveTimeOffRequest: (state, action: PayloadAction<boolean>) => {
      state.isSuccessfull = action.payload;
    },
    updateItemDetail:
      (state, action: PayloadAction<TimeOffRequestItemDetail[]>) => {
        state.detailItemsOfTimeOffRequestScreen3 = action.payload;
      },
    resetSaveTimeOffRequest: (state) => {
      state.isSuccessfull = false;
    },
    navigateToSaveTimeffRequest: (state, action: PayloadAction<boolean>) => {
      state.navigateToSaveTimeffRequest = action.payload;
    },
    saveEndDateOfTimeOffRequest: (state, action: PayloadAction<string>) => {
      state.endDateOfTimeOffRequest = action.payload;
    },
    calculateTotalHoursForFooter: (state) => {
      const totalDuration = state.detailItemsOfTimeOffRequest
        .reduce((accumulator, currentValue) => accumulator + currentValue.duration1 + currentValue.duration2, 0);
      state.summaryOfDetaiItems.totalHours = totalDuration;
    },
    navigateToSaveTimeOffDetailScreen: (state, action: PayloadAction<boolean>) => {
      state.startEditTimeOffRequest = action.payload;
    },
    saveAddTimeOfRequestFormValues: (state, action: PayloadAction<AddTimeOffRequestFormValues>) => {
      state.addTimeOffFormValues = action.payload;
    },
    resetAddTimeOfRequestFormValues: (state) => {
      state.addTimeOffFormValues = getInitialAddTimeOffFormValues();
    },
    saveNotesDetailOfTimeOffRequest: (state, action: PayloadAction<TimeOffRequestNotes[]>) => {
      state.notesDetailOfTimeOffRequest = action.payload;
    },
    navigateToNotesScreen: (state, action: PayloadAction<boolean>) => {
      state.navigateToTimeOffNotesScreen = action.payload;
    },
    saveTimeOffRequestId: (state, action: PayloadAction<Nullable<number>>) => {
      state.timeOffRequestId = action.payload;
    },
    setListOfReviewStatus: (state, action: PayloadAction<number[]>) => {
      state.listOfReviewStatus = action.payload;
    },
    saveSelectedEmployees: (state, action: PayloadAction<ListItem[]>) => {
      state.listOfEmployee = action.payload;
    },
    setUserRole: (state, action: PayloadAction<number>) => {
      state.userRole = action.payload;
    },
    setUserCurrentRole: (state, action: PayloadAction<number>) => {
      state.currentUserRole = action.payload;
    },
    saveSelectedTimesheetGroup: (state, action: PayloadAction<Nullable<ListItem>>) => {
      state.timesheetGroup = action.payload;
    },
    saveNoteValidationMessage: (state, action: PayloadAction<string>) => {
      state.noteValidationMessage = action.payload;
    },
    setNoteSuccess: (state, action: PayloadAction<boolean>) => {
      state.saveNoteSuccess = action.payload;
    },
    setActionIdForManager: (state, action: PayloadAction<number>) => {
      state.actionIdForManager = action.payload;
    },
    saveActionsTimeOffNotes: (state, action: PayloadAction<timeOffAction[]>) => {
      state.actionsTimeOffNotes = action.payload;
    },
    setEmployeeNameForMangerNoteView: (state, action: PayloadAction<Nullable<string>>) => {
      state.employeeNameOfTimeOfRequest = action.payload;
    },
    saveDatesForNotes: (state, action: PayloadAction<string>) => {
      state.datesForNotes = action.payload;
    },
    saveActionsTimeOffDetail: (state, action: PayloadAction<timeOffAction[]>) => {
      state.actionsTimeOffDetail = action.payload;
    },
  },
});

export const getTimeOffRequests = createAction<(GetTimeOffRequest)>('timeOff/getTimeOffRequests');
export const startTimeOffRequest = createAction('timeOff/startTimeOffRequest');
export const getDetailOfTimeOffRequests = createAction<(DetailTimeOffRequestProps)>('timeOff/getDetailOfTimeOffRequests');
export const saveTimeOffRequest = createAction<(SaveTimeOffRequest)>('timeOff/saveTimeOffRequest');
export const timeOffRequestAction = createAction<(TimeOffRequestAction)>('timeOff/timeOffRequestAction');
export const getTimeOffNotes = createAction<(GetTimeOffNotes)>('timeOff/getTimeOffNotes');
export const addTimeOffNotes = createAction<(AddTimeOffNotes)>('timeOff/addTimeOffNotes');

export const {
  setApprovedHolidays,
  setSummaryInformation,
  setTimeOffActions,
  setSummaryOfDetailItems,
  saveTimeOffRequestId,
  setDetailItemsOfTimeOffRequest,
  setPayCodesForDropDownList,
  setNewResquestInformation,
  setExistingRequestIntervals,
  resetSaveTimeOffRequest,
  saveEndDateOfTimeOffRequest,
  successSaveTimeOffRequest,
  updateItemDetail,
  resetAddTimeOfRequestFormValues,
  saveAddTimeOfRequestFormValues,
  saveNotesDetailOfTimeOffRequest,
  calculateTotalHoursForFooter,
  navigateToSaveTimeffRequest,
  navigateToSaveTimeOffDetailScreen,
  navigateToNotesScreen,
  setListOfReviewStatus,
  saveSelectedEmployees,
  setUserRole,
  setUserCurrentRole,
  setEmployeeNameForMangerNoteView,
  saveSelectedTimesheetGroup,
  saveNoteValidationMessage,
  setNoteSuccess,
  setActionIdForManager,
  saveDatesForNotes,
  saveActionsTimeOffDetail,
  saveActionsTimeOffNotes,
} = timeOffSlice.actions;

export default timeOffSlice.reducer;
