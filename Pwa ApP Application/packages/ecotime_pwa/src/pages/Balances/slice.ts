import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { getCurrentFormattedDate } from 'core/utils';
import { UserRole } from 'common/types/types';
import { Nullable } from 'types/common';
import { ListItem } from 'components/DropDown/types';
import {
  BalanceParams,
  BalanceSummary, GetBalanceCategories,
  BalanceForTimesheetGroups, GroupedBalanceSummary, HeaderInfo, InitialState,
  ResourceInformation,
} from './types';

const initialState: InitialState = {
  listBalanceSummary: [],
  headerInfo: null,
  balanceDate: getCurrentFormattedDate(),
  userCurrentRole: UserRole.Employee,
  userRole: -1,
  selectedEmployee: null,
  groupedBalances: null,
  timesheetGroup: null,
  resourceInformation: null,
  balanceParams: null,
};

const balanceSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {
    setBalanceSummary: (state, action: PayloadAction<BalanceSummary[]>) => {
      state.listBalanceSummary = action.payload;
    },
    setHeaderInfo: (state, action: PayloadAction<HeaderInfo>) => {
      state.headerInfo = action.payload;
    },
    setBalanceDate: (state, action: PayloadAction<string | undefined>) => {
      state.balanceDate = action.payload;
    },
    setUserCurrentRole: (state, action: PayloadAction<number>) => {
      state.userCurrentRole = action.payload;
    },
    setUserRole: (state, action: PayloadAction<number>) => {
      state.userRole = action.payload;
    },
    saveEmployee: (state, action: PayloadAction<Nullable<ListItem>>) => {
      state.selectedEmployee = action.payload;
    },
    setBalanceGroupes: (state, action: PayloadAction<Nullable<GroupedBalanceSummary[]>>) => {
      state.groupedBalances = action.payload;
    },
    saveSelectedTimesheetGroup: (state, action: PayloadAction<Nullable<ListItem>>) => {
      state.timesheetGroup = action.payload;
    },
    saveResourceInformation: (state, action: PayloadAction<Nullable<ResourceInformation>>) => {
      state.resourceInformation = action.payload;
    },
    setBalanceParams: (state, action: PayloadAction<Nullable<BalanceParams>>) => {
      state.balanceParams = action.payload;
    },
  },
});

export const getBalanceCategories = createAction<GetBalanceCategories>('balances/getBalanceCategories');

export const getBalanceForTimesheetGroups = createAction<BalanceForTimesheetGroups>('balances/getBalanceForTimesheetGroups');

export const {
  setBalanceSummary,
  setHeaderInfo,
  setBalanceDate,
  setUserCurrentRole,
  setUserRole,
  saveEmployee,
  saveSelectedTimesheetGroup,
  setBalanceGroupes,
  saveResourceInformation,
  setBalanceParams,
} = balanceSlice.actions;

export default balanceSlice.reducer;
