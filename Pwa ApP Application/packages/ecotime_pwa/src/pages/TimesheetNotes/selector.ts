import { RootState } from 'redux/reducer';

export const getNavigateToTimesheetNotes = (state: RootState) => state.timesheetNotes.navigateToNoteScreen;
export const getNotesDetailOfTimesheet = (state: RootState) => state.timesheetNotes.timesheetNotesDetail;
export const getNoteValidation = (state: RootState) => state.timesheetNotes.noteValidationMessage;
export const getNoteSuccess = (state: RootState) => state.timesheetNotes.saveNoteSuccess;
export const getEmployeeNameForManagerNoteView = (state: RootState) => state.timesheetNotes.employeeNameOfSelectedPayPeriod;
