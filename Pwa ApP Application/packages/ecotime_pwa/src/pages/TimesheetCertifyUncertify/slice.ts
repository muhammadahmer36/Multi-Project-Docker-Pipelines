import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { CertifyItem, InitialState, TimesheetListPayload } from './types';

const initialState: InitialState = {
  certifyList: [],
  unCertifyList: [],
  date: '',
};

const responseSlice = createSlice({
  name: 'timesheetCertifyUncertify',
  initialState,
  reducers: {

    setCertifyList: (state, action: PayloadAction<CertifyItem[]>) => {
      state.certifyList = action.payload;
    },
    setUncertifyList: (state, action: PayloadAction<CertifyItem[]>) => {
      state.unCertifyList = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    reset: () => initialState,

  },
});

export const getTimesheetCertifyUncertifyList = createAction<
TimesheetListPayload>('timesheetCertifyUncertify/getTimesheetCertifyUncertifyList');

export const {
  setCertifyList, setUncertifyList, setDate, reset,
} = responseSlice.actions;

export default responseSlice.reducer;
