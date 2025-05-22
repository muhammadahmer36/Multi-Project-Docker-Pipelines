import { createAction, createSlice } from '@reduxjs/toolkit';
import { IRegistration } from './types';
import { ISamlLoginPayload } from '../common/types';

const initialState = {
  token: '',
  refreshToken: '',
  userName: '',
  isLoading: false,
  employeeDetail: {
    employeeEmail: '',
    employeeName: '',
    loginName: '',
    employeeNumber: '',
  },
  loginData: {
    deviceId: '',
    deviceName: '',
    loginName: '',
  },
  validation: {
    statusCode: null,
    statusMessage: '',
  },
};

const samlSlice = createSlice({
  name: 'saml',
  initialState,
  reducers: {
    samlUserRegistration: (state) => {
      state.isLoading = true;
    },
    samlUserLogin: (state) => {
      state.isLoading = true;
    },
    samlUserRegistrationSuccess(state, action) {
      state.validation = action.payload;
      state.isLoading = false;
    },
    samlUserRegistrationFailure(state, action) {
      state.validation = action.payload;
      state.isLoading = false;
    },
    saveEmployeeDetailForRegistration(state, action) {
      state.employeeDetail = action.payload;
    },
    getLoginSuccess(state, action) {
      const { token, refreshToken } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isLoading = false;
    },
    getLoginFailure(state, action) {
      state.validation = action.payload;
      state.isLoading = false;
    },
    resetValidation(state) {
      state.validation = {
        statusCode: null,
        statusMessage: '',
      };
    },
  },
});

export const registerSamlUser = createAction<IRegistration>(
  'saml/samlUserRegistration',
);

export const loginSamlUser = createAction<ISamlLoginPayload>('saml/samlUserLogin');

export const {
  samlUserRegistrationSuccess,
  samlUserRegistration,
  getLoginSuccess,
  samlUserRegistrationFailure,
  saveEmployeeDetailForRegistration,
  getLoginFailure,
  samlUserLogin,
  resetValidation,
} = samlSlice.actions;

export default samlSlice.reducer;
