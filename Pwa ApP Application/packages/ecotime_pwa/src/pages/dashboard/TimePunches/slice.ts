import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { Nullable } from 'types/common';
import {
  ClockWidgetItem,
  InitialState,
  TimePunch,
  TimePunchActionPayload,
} from './types';

const initialState: InitialState = {
  showLoader: false,
  timeIn: null,
  timeOut: null,
  transfer: null,
  currentPunch: null,
  nextPunch: null,
  lastPunch: '',
  dateTimeUTC: '',
  clockComponentItems: [],
};

const timePunchSlice = createSlice({
  name: 'timePunch',
  initialState,
  reducers: {
    setShowLoader: (state, action: PayloadAction<boolean>) => {
      state.showLoader = action.payload;
    },
    setTimeIn: (state, action: PayloadAction<Nullable<ClockWidgetItem>>) => {
      state.timeIn = action.payload;
    },
    setTimeOut: (state, action: PayloadAction<Nullable<ClockWidgetItem>>) => {
      state.timeOut = action.payload;
    },
    setTransfer: (state, action: PayloadAction<Nullable<ClockWidgetItem>>) => {
      state.transfer = action.payload;
    },
    setCurrentPunch: (state, action: PayloadAction<Nullable<TimePunch>>) => {
      state.currentPunch = action.payload;
    },
    setNextPunch: (state, action: PayloadAction<Nullable<TimePunch>>) => {
      state.nextPunch = action.payload;
    },
    setLastPunch: (state, action: PayloadAction<string>) => {
      state.lastPunch = action.payload;
    },
    setDateTimeUTC: (state, action: PayloadAction<string>) => {
      state.dateTimeUTC = action.payload;
    },
    setClockComponentItems: (state, action: PayloadAction<ClockWidgetItem[]>) => {
      state.clockComponentItems = action.payload;
    },
  },
});

export const timePunch = createAction<TimePunchActionPayload>('time/timePunch');
export const timePunchingComponents = createAction('time/timePunchingComponents');

const { actions, reducer } = timePunchSlice;
export const {
  setShowLoader,
  setTimeIn,
  setTimeOut,
  setTransfer,
  setCurrentPunch,
  setNextPunch,
  setLastPunch,
  setDateTimeUTC,
  setClockComponentItems,
} = actions;

export default reducer;
