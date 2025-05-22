/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IActiveDirectoryLoginSuccess, ILoginActiveDirectoryPayload } from './types';

const initialState = {
  token: '',
  refreshToken: '',
  userName: '',
  isLoading: false,
  dateTimeFormatClockWidget: '',
  dashboardItems: [],
  validation: {
    statusCode: 0,
    statusMessage: '',
  },
  loginData: {
    deviceId: '',
    rememberMe: false,
    deviceName: '',
    loginName: '',
    password: '',
  },
};

const activeDirectoryLoginSlice = createSlice({
  name: 'activeDirectoryLogin',
  initialState,
  reducers: {
    loginActiveDirectoryUser: (state, action:
      PayloadAction<ILoginActiveDirectoryPayload>) => {
      state.isLoading = true;
    },
    getLoginActiveDirectorySuccess(state, action: PayloadAction<IActiveDirectoryLoginSuccess>) {
      const {
        token, refreshToken,
      } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isLoading = false;
    },
    saveLoginDataForRegistrationSuccess(state, action) {
      state.loginData = action.payload;
    },
    getLoginActiveDirectoryFailure(state, action) {
      state.validation = action.payload;
      state.isLoading = false;
    },
    resetActiveDirectoryUserSession(state) {
      state.refreshToken = '';
      state.token = '';
      state.userName = '';
    },
    resetServerValidation(state) {
      state.validation = {
        statusCode: 0,
        statusMessage: '',
      };
    },

  },
});

export const {
  getLoginActiveDirectorySuccess,
  getLoginActiveDirectoryFailure,
  saveLoginDataForRegistrationSuccess,
  loginActiveDirectoryUser,
  resetServerValidation,
  resetActiveDirectoryUserSession,
} = activeDirectoryLoginSlice.actions;

export default activeDirectoryLoginSlice.reducer;
