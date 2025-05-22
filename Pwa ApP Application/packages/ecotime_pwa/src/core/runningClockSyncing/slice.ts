import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BackgroundTimeSyncing } from './types';

const initialState: BackgroundTimeSyncing = {
  backgroundTime: null,
  appBackgroundDuration: null,
  runningClock: null,
  runningClockDBServerGMT: null,
};

const backgroundTimeSyncing = createSlice({
  name: 'backgroundTimeSyncing',
  initialState,
  reducers: {
    setBackgroundTime(state, action: PayloadAction<number | null>) {
      state.backgroundTime = action.payload;
    },
    setAppBackgroundDuration(state, action: PayloadAction<number | null>) {
      state.appBackgroundDuration = action.payload;
    },
    setRunningClock(state, action: PayloadAction<number | null>) {
      state.runningClock = action.payload;
    },
    setRunningClockDBServerGMT(state, action: PayloadAction<number | null>) {
      state.runningClockDBServerGMT = action.payload;
    },
  },
});

export const {
  setBackgroundTime,
  setAppBackgroundDuration,
  setRunningClock,
  setRunningClockDBServerGMT,
} = backgroundTimeSyncing.actions;

export default backgroundTimeSyncing.reducer;
