import { RootState } from 'redux/reducer';

export const getApprovedTimeOffs = (state: RootState) => state.timeOff.aprrovedTimeOffRequests;

export const getSummaryInformation = (state: RootState) => state.timeOff.summaryInfomartion;

export const getTimeOffActions = (state: RootState) => state.timeOff.timeOffActions;

export const getItemDetailOfTimeOffRequests = (state: RootState) => state.timeOff.detailItemsOfTimeOffRequest;

export const getSummaryOfItemsDetail = (state: RootState) => state.timeOff.summaryOfDetaiItems;

export const getItemDetailOfTimeOffRequestsScreen3 = (state: RootState) => state.timeOff.detailItemsOfTimeOffRequestScreen3;

export const getSearchConfigurationForTimeOffRequestColor = (state: RootState) => state.common.searchConfiguration;

export const getPayCodesForDropDownList = (state: RootState) => state.timeOff.payCodesForDropDownList;

export const getNewRequestInformation = (state: RootState) => state.timeOff.newRequestInfo;

export const getExistingRequestIntervals = (state: RootState) => state.timeOff.existingRequestIntervals;

export const getSuccessTimeOffRequest = (state: RootState) => state.timeOff.isSuccessfull;

export const getNavigateToSaveTimeffRequest = (state: RootState) => state.timeOff.navigateToSaveTimeffRequest;

export const getEndDateOfTimeOffRequest = (state: RootState) => state.timeOff.endDateOfTimeOffRequest;

export const getNavigateToSaveTimeOffDetail = (state: RootState) => state.timeOff.startEditTimeOffRequest;

export const getAddTimeOffRequestFormValues = (state: RootState) => state.timeOff.addTimeOffFormValues;

export const getCalendarDateForListView = (state: RootState) => state.timeOff.calendarDateForListView;

export const getNavigateToTimeOffNotes = (state: RootState) => state.timeOff.navigateToTimeOffNotesScreen;

export const getNotesDetailOfTimeOffRequest = (state: RootState) => state.timeOff.notesDetailOfTimeOffRequest;

export const getTimeOffRequestId = (state: RootState) => state.timeOff.timeOffRequestId;

export const getListOfReviewStatus = (state: RootState) => state.timeOff.listOfReviewStatus;

export const getListOfEmployees = (state: RootState) => state.timeOff.listOfEmployee;

export const getSelectedTimesheetGroup = (state: RootState) => state.timeOff.timesheetGroup;

export const getUserRole = (state: RootState) => state.timeOff.userRole;

export const getCurrentMode = (state: RootState) => state.timeOff.currentUserRole;

export const getNoteSuccess = (state: RootState) => state.timeOff.saveNoteSuccess;

export const getNoteValidation = (state: RootState) => state.timeOff.noteValidationMessage;

export const getSelectedActionForManager = (state: RootState) => state.timeOff.actionIdForManager;

export const getEmployeeNameForManagerNoteView = (state: RootState) => state.timeOff.employeeNameOfTimeOfRequest;

export const getDateForNoteScreen = (state: RootState) => state.timeOff.datesForNotes;

export const getActionsTimeOffDetail = (state: RootState) => state.timeOff.actionsTimeOffDetail;

export const getActionsTimeOffNotes = (state: RootState) => state.timeOff.actionsTimeOffNotes;
