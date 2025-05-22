import { RootState } from 'redux/reducer';

export const getConnectivity = (state: RootState) => state.internetStatusBar.offline;
export const getShowInternetRestoredSnackbar = (state: RootState) => state.internetStatusBar.showInternetRestoredSnackbar;
