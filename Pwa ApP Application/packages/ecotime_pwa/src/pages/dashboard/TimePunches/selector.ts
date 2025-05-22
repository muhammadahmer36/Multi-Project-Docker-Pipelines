import { RootState } from 'redux/reducer';

export const getTansfer = (state: RootState) => state.timePunch.transfer;
export const getShowLoader = (state: RootState) => state.timePunch.showLoader;
export const getTimeIn = (state: RootState) => state.timePunch.timeIn;
export const getTimeOut = (state: RootState) => state.timePunch.timeOut;
export const getTransfer = (state: RootState) => state.timePunch.transfer;
export const getNexPunch = (state: RootState) => state.timePunch.nextPunch;
export const getLastPunch = (state: RootState) => state.timePunch.lastPunch;
export const getCurrentPunch = (state: RootState) => state.timePunch.currentPunch;
export const getDateTimeUtC = (state: RootState) => state.timePunch.dateTimeUTC;
export const getClockComponentItems = (state: RootState) => state.timePunch.clockComponentItems;
