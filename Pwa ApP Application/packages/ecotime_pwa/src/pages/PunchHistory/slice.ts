import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { InitialState, PunchHistory, maximumPhunchHistoryDaysLimitation } from './types';

const initialState: InitialState = {
  punchHistoryList: [],
  phunchHistorySearchAbleDays: maximumPhunchHistoryDaysLimitation,
};

const punchHistorySlice = createSlice({
  name: 'punchHistory',
  initialState,
  reducers: {
    setPunchHistory: (state, action: PayloadAction<PunchHistory[]>) => {
      state.punchHistoryList = action.payload;
    },
    setPunchHistoryDayLimitSearch: (state, action: PayloadAction<number>) => {
      state.phunchHistorySearchAbleDays = action.payload;
    },
  },
});

export const getPunchHistoryList = createAction<(string | undefined)[]>('punchHistory/getPunchHistoryList');

export const {
  setPunchHistory,
  setPunchHistoryDayLimitSearch,
} = punchHistorySlice.actions;

export default punchHistorySlice.reducer;
