import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import {
  BalanceCategory, BalanceGroupDetails, CategoryProps, HeaderInfo, InitialState,
} from './types';

const initialState: InitialState = {
  balanceCategory: [],
  balanceGroupDetails: [],
  headerInfo: null,
};

const balanceSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setBalanceCategories: (state, action: PayloadAction<BalanceCategory[]>) => {
      state.balanceCategory = action.payload;
    },
    setBalanceGroupDetails: (state, action: PayloadAction<BalanceGroupDetails[]>) => {
      state.balanceGroupDetails = action.payload;
    },
    setHeaderInfo: (state, action: PayloadAction<HeaderInfo>) => {
      state.headerInfo = action.payload;
    },
  },
});

export const getCategories = createAction<CategoryProps>('category/getCategories');

export const {
  setBalanceCategories,
  setBalanceGroupDetails,
  setHeaderInfo,
} = balanceSlice.actions;

export default balanceSlice.reducer;
