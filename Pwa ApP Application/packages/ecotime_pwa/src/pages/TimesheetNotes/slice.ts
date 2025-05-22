import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Nullable } from 'types/common';
import {
  GetTimesheetNotes,
  InitialState,
  TimesheetAddNotes,
  TimesheetNotes,
} from './types';

const initialState: InitialState = {
  timesheetNotesDetail: [],
  noteValidationMessage: '',
  saveNoteSuccess: false,
  employeeNameOfSelectedPayPeriod: null,
};

const timesheetNotesSlice = createSlice({
  name: 'timesheetNotes',
  initialState,
  reducers: {
    saveTimesheetNotes: (state, action: PayloadAction<TimesheetNotes[]>) => {
      state.timesheetNotesDetail = action.payload;
    },
    saveNoteValidationMessage: (state, action: PayloadAction<string>) => {
      state.noteValidationMessage = action.payload;
    },
    setNoteSuccess: (state, action: PayloadAction<boolean>) => {
      state.saveNoteSuccess = action.payload;
    },
    setEmployeeNameForMangerNoteView: (state, action: PayloadAction<Nullable<string>>) => {
      state.employeeNameOfSelectedPayPeriod = action.payload;
    },
  },
});

export const getTimesheetNotes = createAction<GetTimesheetNotes>('timesheet/getTimesheetNotes');
export const addTimesheetNotes = createAction<(TimesheetAddNotes)>('timesheet/timesheetNotes');

export const {
  saveTimesheetNotes,
  setNoteSuccess,
  saveNoteValidationMessage,
  setEmployeeNameForMangerNoteView,
} = timesheetNotesSlice.actions;

export default timesheetNotesSlice.reducer;
