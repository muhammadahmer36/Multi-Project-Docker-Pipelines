import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ListItem } from 'components/DropDown/types';
import { UserRole } from 'common/types/types';
import {
  Calculated,
  InitialState,
  PayPeriodSummary,
  Reported,
  Timesheet,
  TimesheetActionPayload,
  TimesheetListPayload,
} from './types';

const initialState: InitialState = {
  timesheet: null,
  reportedList: [],
  calculatedList: [],
  payPeriodList: [],
  payPeriod: null,
  payPeriodSummary: null,
  reported: 0,
  calculated: 0,
  visibleInformationPopup: false,
  visibleCertifyPopup: false,
  employeeInformation: [],
  selectedTab: 0,
  userCurrentRole: UserRole.Employee,
  userRole: -1,
};

const punchHistorySlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    setTimeSheet: (state, action: PayloadAction<Timesheet>) => {
      state.timesheet = action.payload;
    },
    setReportedList: (state, action: PayloadAction<Reported[]>) => {
      state.reportedList = action.payload;
    },
    setCalculatedList: (state, action: PayloadAction<Calculated[]>) => {
      state.calculatedList = action.payload;
    },
    setPayPeriodList: (state, action: PayloadAction<ListItem[]>) => {
      state.payPeriodList = action.payload;
    },
    setPayPeriod: (state, action: PayloadAction<ListItem>) => {
      state.payPeriod = action.payload;
    },
    setPayPeriodSummary: (state, action: PayloadAction<PayPeriodSummary>) => {
      state.payPeriodSummary = action.payload;
    },
    setReported: (state, action: PayloadAction<number>) => {
      state.reported = action.payload;
    },
    setCalculated: (state, action: PayloadAction<number>) => {
      state.calculated = action.payload;
    },
    setVisibleInformationPopup: (state, action: PayloadAction<boolean>) => {
      state.visibleInformationPopup = action.payload;
    },
    setVisibleCertifyPopup: (state, action: PayloadAction<boolean>) => {
      state.visibleCertifyPopup = action.payload;
    },
    setEmployeeInformation: (state, action: PayloadAction<string[]>) => {
      state.employeeInformation = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload;
    },
    setUserCurrentRole: (state, action: PayloadAction<number>) => {
      state.userCurrentRole = action.payload;
    },
    setUserRole: (state, action: PayloadAction<number>) => {
      state.userRole = action.payload;
    },
  },
});

export const getTimesheetList = createAction<TimesheetListPayload>('timesheet/getTimesheetList');
export const certifyTimesheet = createAction<TimesheetActionPayload>('timesheet/certifyTimeSheet');
export const calculateTimesheet = createAction<TimesheetActionPayload>('timesheet/calculateTimeSheet');

export const {
  setTimeSheet,
  setReportedList,
  setPayPeriodList,
  setPayPeriod,
  setPayPeriodSummary,
  setReported,
  setCalculated,
  setVisibleInformationPopup,
  setVisibleCertifyPopup,
  setCalculatedList,
  setSelectedTab,
  setEmployeeInformation,
  setUserCurrentRole,
  setUserRole,
} = punchHistorySlice.actions;

export default punchHistorySlice.reducer;
