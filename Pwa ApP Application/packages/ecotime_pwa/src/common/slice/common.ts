import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchConfiguration } from 'pages/TimeOffCalendar/types';
import { CommonInitialState, EmployeeListQueryParams } from 'common/types/types';
import { Nullable } from 'types/common';
import { ListItem } from 'components/DropDown/types';

const initialState: CommonInitialState = {
  uniqueId: '',
  searchConfiguration: [],
  authenticationTypeId: null,
  employeeList: [],
  timsheetGroups: [],
  dropDownListLoader: false,
};

const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUniqueId: (state, action: PayloadAction<string>) => {
      state.uniqueId = action.payload;
    },
    setSearchConfigurationForTimeOffRequestColors:
      (state, action: PayloadAction<SearchConfiguration[]>) => {
        state.searchConfiguration = action.payload;
      },
    setAuthenticationType: (state, action: PayloadAction<Nullable<number>>) => {
      state.authenticationTypeId = action.payload;
    },
    setEmployeeList: (state, action: PayloadAction<ListItem[]>) => {
      state.employeeList = action.payload;
    },
    setTimsheetGroups: (state, action: PayloadAction<ListItem[]>) => {
      state.timsheetGroups = action.payload;
    },
    setDropDownLoader: (state, action: PayloadAction<boolean>) => {
      state.dropDownListLoader = action.payload;
    },
  },
});

export const getAuthenticationType = createAction<string>('common/getAuthenticationType');

export const getEmployeesOfManger = createAction<EmployeeListQueryParams>('common/getEmployeesOfManger');

export const getTimesheetGroups = createAction<string>('common/getTimesheetGroups');

export const {
  setUniqueId,
  setAuthenticationType,
  setEmployeeList,
  setTimsheetGroups,
  setDropDownLoader,
  setSearchConfigurationForTimeOffRequestColors,
} = common.actions;

export default common.reducer;
