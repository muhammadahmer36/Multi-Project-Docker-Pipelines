/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Nullable } from 'types/common';
import { DataSets, IFormAdditionalData, InitialState } from './types';

const initialState: InitialState = {
  showLoader: false,
  additionalInformationIn: null,
  additionalInformationOut: undefined,
  additionalInformationTransfer: undefined,
  openAdditionalInformationForm: false,
  navigateToDashboard: false,
  disableHeader: false,
  punchHeaderInformation: '',
  timePunchId: null,
  navigator: null,

};

const additionalInformationSlice = createSlice({
  name: 'additionalInformation',
  initialState,
  reducers: {
    setAdditionalInformationIn: (state, action: PayloadAction<DataSets>) => {
      state.additionalInformationIn = action.payload;
    },
    setAdditionalInformationOut: (state, action: PayloadAction<Nullable<DataSets>>) => {
      state.additionalInformationOut = action.payload;
    },
    setAdditionalInformationTransfer: (state, action: PayloadAction<Nullable<DataSets>>) => {
      state.additionalInformationTransfer = action.payload;
    },
    setPunchHeaderInformation: (state, action: PayloadAction<string>) => {
      state.punchHeaderInformation = action.payload;
    },
    setShowLoader: (state, action: PayloadAction<boolean>) => {
      state.showLoader = action.payload;
    },
    savePunchIdForAdditionalData: (state, action: PayloadAction<number>) => {
      state.timePunchId = action.payload;
    },
    disableApplicationHeader: (state, action: PayloadAction<boolean>) => {
      state.disableHeader = action.payload;
    },
    navigateToAdditionalDataForm: (state, action: PayloadAction<boolean>) => {
      state.openAdditionalInformationForm = action.payload;
    },
    navigateBackToDashboard: (state) => {
      state.navigateToDashboard = true;
    },
    resetNavigateBackToDashboard: (state) => {
      state.navigateToDashboard = false;
    },
  },
});

export const postAdditionalDataForm = createAction<IFormAdditionalData>('postAdditionalDataForm/additionalInformation');
export const getAdditionalInformation = createAction('additionalInformation/getAdditionalInformation');

export const {
  setAdditionalInformationIn,
  setAdditionalInformationOut,
  setAdditionalInformationTransfer,
  navigateToAdditionalDataForm,
  setPunchHeaderInformation,
  savePunchIdForAdditionalData,
  setShowLoader,
  navigateBackToDashboard,
  resetNavigateBackToDashboard,
  disableApplicationHeader,
} = additionalInformationSlice.actions;

export default additionalInformationSlice.reducer;
