import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectivityState } from './type';

const initialState: ConnectivityState = {
  offline: null,
  showInternetRestoredSnackbar: false,
};

const connectivitySlice = createSlice({
  name: 'internetStatusBar',
  initialState,
  reducers: {
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.offline = action.payload;
    },
    setShowInternetRestoredSnackbar: (state, action: PayloadAction<boolean>) => {
      state.showInternetRestoredSnackbar = action.payload;
    },
    resetInternetStatusBar: () => initialState,
  },
});

export const { setOffline, setShowInternetRestoredSnackbar, resetInternetStatusBar } = connectivitySlice.actions;

export default connectivitySlice.reducer;
