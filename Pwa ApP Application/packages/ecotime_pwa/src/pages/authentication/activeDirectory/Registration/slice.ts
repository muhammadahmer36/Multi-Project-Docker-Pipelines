/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRegistrationActiveDirectoryPayload, IValidation } from './types';

const initialState = {
  isLoading: false,
  employeeDetail: {
    employeeEmail: '',
    employeeName: '',
    loginName: '',
    employeeNumber: '',
  },
  validation: {
    statusCode: null,
    statusMessage: '',
  },
};

const activeDirectoryRegistrationSlice = createSlice({
  name: 'activeDirectoryRegistration',
  initialState,
  reducers: {
    registerActiveDirectoryUser: (state, action:
      PayloadAction<IRegistrationActiveDirectoryPayload>) => {
      state.isLoading = true;
    },
    getActiveDirectoryRegistrationSuccess(state, action) {
      state.validation = action.payload;
      state.isLoading = false;
    },
    getActiveDirectoryRegistrationFailure(state, action) {
      state.validation = action.payload;
      state.isLoading = false;
    },
    saveEmployeeDetailForRegistration(state, action) {
      state.employeeDetail = action.payload;
    },
    resetValidation(state) {
      state.validation = {
        statusCode: null,
        statusMessage: '',
      };
    },

  },
});

export const {
  getActiveDirectoryRegistrationSuccess,
  registerActiveDirectoryUser,
  getActiveDirectoryRegistrationFailure,
  saveEmployeeDetailForRegistration,
  resetValidation,
} = activeDirectoryRegistrationSlice.actions;

export default activeDirectoryRegistrationSlice.reducer;
