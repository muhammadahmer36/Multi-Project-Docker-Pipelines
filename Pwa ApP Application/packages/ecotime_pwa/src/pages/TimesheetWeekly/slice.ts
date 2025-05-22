import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ListItem } from 'components/DropDown/types';
import { Nullable } from 'types/common';
import {
  Calculated,
  InitialState,
  PayPeriodSummary,
  Reported,
  Timesheet,
  TimesheetListPayload,
  Week,
} from './types';

const initialState: InitialState = {
  timesheet: null,
  weeks: [],
  reportedList: [],
  calculatedList: [],
  weekList: [],
  week: null,
  payPeriodSummary: null,
  reported: 0,
  calculated: 0,
  visibleInformationPopup: false,
  visibleCertifyPopup: false,
  employeeInformation: [],
  groupTitle: '',
};

const punchHistorySlice = createSlice({
  name: 'timesheetWeekly',
  initialState,
  reducers: {
    setTimeSheet: (state, action: PayloadAction<Timesheet>) => {
      state.timesheet = action.payload;
    },
    setReportedList: (state, action: PayloadAction<Reported[]>) => {
      state.reportedList = action.payload;
    },
    setCalculatedList: (state, action: PayloadAction<Calculated[]>) => {
      state.calculatedList = action.payload;
    },
    setWeekList: (state, action: PayloadAction<ListItem[]>) => {
      state.weekList = action.payload;
    },
    setWeek: (state, action: PayloadAction<Nullable<ListItem>>) => {
      state.week = action.payload;
    },
    setPayPeriodSummary: (state, action: PayloadAction<PayPeriodSummary>) => {
      state.payPeriodSummary = action.payload;
    },
    setReported: (state, action: PayloadAction<number>) => {
      state.reported = action.payload;
    },
    setCalculated: (state, action: PayloadAction<number>) => {
      state.calculated = action.payload;
    },
    setVisibleInformationPopup: (state, action: PayloadAction<boolean>) => {
      state.visibleInformationPopup = action.payload;
    },
    setVisibleCertifyPopup: (state, action: PayloadAction<boolean>) => {
      state.visibleCertifyPopup = action.payload;
    },
    setEmployeeInformation: (state, action: PayloadAction<string[]>) => {
      state.employeeInformation = action.payload;
    },
    setWeeks: (state, action: PayloadAction<Week[]>) => {
      state.weeks = action.payload;
    },
    setGroupTitle: (state, action: PayloadAction<string>) => {
      state.groupTitle = action.payload;
    },

    reset: () => initialState,
  },
});

export const getTimesheetWeeklyList = createAction<TimesheetListPayload>('timesheetWeekly/getTimesheetListWeekly');

export const {
  setTimeSheet,
  setReportedList,
  setWeekList,
  setWeek,
  setPayPeriodSummary,
  setReported,
  setCalculated,
  setVisibleInformationPopup,
  setVisibleCertifyPopup,
  setCalculatedList,
  setEmployeeInformation,
  setWeeks,
  setGroupTitle,
  reset,
} = punchHistorySlice.actions;

export default punchHistorySlice.reducer;
