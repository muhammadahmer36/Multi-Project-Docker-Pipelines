import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListItem } from 'components/DropDown/types';
import { EmployeeDetail, InitialState, TimesheetActionPayload } from './types';

const initialState: InitialState = {
  employeeDetail: [],
  checkedItems: [],
  visibleApprovedConsent: false,
  visibleUnApprovedConsent: false,
  check: false,
  payPeriod: { code: '', description: '' },
  selectedTimesheet: null,
};

const employeeSlice = createSlice({
  name: 'timesheetManager',
  initialState,
  reducers: {
    setEmployeeDetail(state, action: PayloadAction<EmployeeDetail[]>) {
      state.employeeDetail = action.payload;
    },
    setCheckedItems(state, action: PayloadAction<boolean[]>) {
      state.checkedItems = action.payload;
    },
    setVisibleApprovedConsent(state, action: PayloadAction<boolean>) {
      state.visibleApprovedConsent = action.payload;
    },
    setVisibleUnApprovedConsent(state, action: PayloadAction<boolean>) {
      state.visibleUnApprovedConsent = action.payload;
    },
    setCheck(state, action: PayloadAction<boolean>) {
      state.check = action.payload;
    },
    setPayPeriod(state, action: PayloadAction<ListItem>) {
      state.payPeriod = action.payload;
    },
    setSelectedTimsheet(state, action: PayloadAction<EmployeeDetail>) {
      state.selectedTimesheet = action.payload;
    },
    reset: () => initialState,
  },
});

export const timesheetAction = createAction<TimesheetActionPayload>('timesheetManager/timesheetAction');

export const {
  setEmployeeDetail,
  setVisibleApprovedConsent,
  setVisibleUnApprovedConsent,
  setCheckedItems,
  setCheck,
  setPayPeriod,
  setSelectedTimsheet,
  reset,
} = employeeSlice.actions;
export default employeeSlice.reducer;
