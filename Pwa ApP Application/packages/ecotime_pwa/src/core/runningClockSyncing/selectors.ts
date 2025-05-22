import { RootState } from 'redux/reducer';

export const getBackgroundTime = (state: RootState) => state.runningClockSyncing.backgroundTime;
export const getAppBackgroundDuration = (state: RootState) => state.runningClockSyncing.appBackgroundDuration;
export const getRunningClock = (state: RootState) => state.runningClockSyncing.runningClock;
export const getRunningClockDBServerGMT = (state: RootState) => state.runningClockSyncing.runningClockDBServerGMT;
