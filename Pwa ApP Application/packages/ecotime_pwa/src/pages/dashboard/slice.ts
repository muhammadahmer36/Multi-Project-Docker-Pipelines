import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Nullable } from 'types/common';
import { dateTimeInformation, applicationInfo } from 'appConstants/defaultApplicationSetting';
import {
  ApplicationInfo, DashboardItem, InitialState, DateTimeFormats,
} from './types';

const initialState: InitialState = {
  balances: null,
  timePunches: undefined,
  timeOff: undefined,
  timeSheet: undefined,
  appInformation: { ...applicationInfo },
  timeAndDateInformation: { ...dateTimeInformation },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setBalances: (state, action: PayloadAction<Nullable<DashboardItem>>) => {
      state.balances = action.payload;
    },
    setTimePunches: (state, action: PayloadAction<Nullable<DashboardItem>>) => {
      state.timePunches = action.payload;
    },
    setTimeOff: (state, action: PayloadAction<Nullable<DashboardItem>>) => {
      state.timeOff = action.payload;
    },
    setTimeSheet: (state, action: PayloadAction<Nullable<DashboardItem>>) => {
      state.timeSheet = action.payload;
    },
    setAppInformation: (state, action: PayloadAction<ApplicationInfo>) => {
      state.appInformation = action.payload;
    },
    setTimeAndDateInformation: (state, action: PayloadAction<DateTimeFormats>) => {
      state.timeAndDateInformation = action.payload;
    },
  },
});

export const setDashboardItems = createAction<DashboardItem[]>('dashboard/setDashboardItems');

export const {
  setBalances,
  setTimePunches,
  setTimeOff,
  setTimeSheet,
  setAppInformation,
  setTimeAndDateInformation,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
