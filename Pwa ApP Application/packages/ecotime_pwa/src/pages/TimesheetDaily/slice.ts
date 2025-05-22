import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ListItem } from 'components/DropDown/types';
import {
  DailyDetail,
  InitialState,
  Timesheet,
  TimesheetListPayload,
} from './types';

const initialState: InitialState = {
  timesheet: undefined,
  days: [],
  day: {
    code: '',
    description: '',
  },
  dailyDetails: [],
  reportedHours: '',
};

const punchHistorySlice = createSlice({
  name: 'timesheetDaily',
  initialState,
  reducers: {
    setTimeSheet: (state, action: PayloadAction<Timesheet>) => {
      state.timesheet = action.payload;
    },
    setDayList: (state, action: PayloadAction<ListItem[]>) => {
      state.days = action.payload;
    },
    setReportedHours: (state, action: PayloadAction<string>) => {
      state.reportedHours = action.payload;
    },
    setDailyDetail: (state, action: PayloadAction<DailyDetail[]>) => {
      state.dailyDetails = action.payload;
    },
    setDay: (state, action: PayloadAction<ListItem>) => {
      state.day = action.payload;
    },
    reset: () => initialState,
  },
});

export const getTimesheetDailyList = createAction<TimesheetListPayload>('timesheetDaily/getTimesheetListDaily');

export const {
  setTimeSheet,
  setDayList,
  setDay,
  reset,
  setDailyDetail,
  setReportedHours,
} = punchHistorySlice.actions;

export default punchHistorySlice.reducer;
