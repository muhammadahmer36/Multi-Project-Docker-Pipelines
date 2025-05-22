import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ListItem } from 'components/DropDown/types';
import { Nullable } from 'types/common';
import { TimesheetSearchParamsPayload } from 'pages/Timesheet/types';
import { InitialState, SearchStatus, TimesheetSearchResultPayload } from './types';

const initialState: InitialState = {
  payPeriodList: [],
  payPeriod: { code: '', description: '' },
  timehseetGroupList: [],
  timehseetGroup: undefined,
  employeeList: [],
  SearchStatus: [],
  selectedSearchStatus: [],
  selectedEmployeeList: [],
  selectedEmployeeGroup: { code: '', description: '' },
  payPeriodDefault: { code: '', description: '' },
};

const timesheetSearchManager = createSlice({
  name: 'timesheetSearchManager',
  initialState,
  reducers: {
    setPayPeriodList: (state, action: PayloadAction<ListItem[]>) => {
      state.payPeriodList = action.payload;
    },
    setPayPeriod: (state, action: PayloadAction<ListItem>) => {
      state.payPeriod = action.payload;
    },
    setDefaultPayPeriod: (state, action: PayloadAction<ListItem>) => {
      state.payPeriodDefault = action.payload;
    },
    setTimehseetGroupList: (state, action: PayloadAction<ListItem[]>) => {
      state.payPeriodList = action.payload;
    },
    setTimehseetGroup: (state, action: PayloadAction<ListItem>) => {
      state.payPeriod = action.payload;
    },
    setEmployeeList: (state, action: PayloadAction<ListItem[]>) => {
      state.employeeList = action.payload;
    },
    setSearchStatusList: (state, action: PayloadAction<SearchStatus[]>) => {
      state.SearchStatus = action.payload;
    },
    setSelectSearchStatusList: (state, action: PayloadAction<number>) => {
      state.selectedSearchStatus.push(action.payload);
    },
    setUnSelectSearchStatusList: (state, action: PayloadAction<number>) => {
      state.selectedSearchStatus = state.selectedSearchStatus.filter((item) => item !== action.payload);
    },
    setSelectSearchStatusListReset: (state) => {
      state.selectedSearchStatus = [];
    },
    setSelectedEmployeeList: (state, action: PayloadAction<ListItem[]>) => {
      state.selectedEmployeeList = action.payload;
    },
    setSelectedEmployeeGroup: (state, action: PayloadAction<Nullable<ListItem>>) => {
      state.selectedEmployeeGroup = action.payload;
    },
    reset: () => initialState,
  },
});

export
const getTimesheetSearchParam = createAction<TimesheetSearchParamsPayload>('timesheetSearchManager/getTimesheetSearchParam');
export
const getTimesheetSearchResult = createAction<TimesheetSearchResultPayload>('timesheetSearchManager/getTimesheetSearchResult');

export const {
  setPayPeriodList,
  setPayPeriod,
  reset,
  setTimehseetGroup,
  setEmployeeList,
  setSearchStatusList,
  setSelectSearchStatusList,
  setUnSelectSearchStatusList,
  setSelectedEmployeeGroup,
  setSelectedEmployeeList,
  setSelectSearchStatusListReset,
  setDefaultPayPeriod,

} = timesheetSearchManager.actions;

export default timesheetSearchManager.reducer;
