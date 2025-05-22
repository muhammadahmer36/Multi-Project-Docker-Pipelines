import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Severity } from 'components/SnackBar/types';
import { Configuration, PopupState } from './types';

const initialState: PopupState = {
  visible: false,
  configuration: {
    message: null,
    severity: Severity.SUCCESS,
  },
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    openPopup(state, action: PayloadAction<Configuration>) {
      state.visible = true;
      state.configuration = action.payload;
    },
    closePopup(state) {
      state.visible = false;
    },
  },
});

export const { openPopup, closePopup } = popupSlice.actions;
export default popupSlice.reducer;
