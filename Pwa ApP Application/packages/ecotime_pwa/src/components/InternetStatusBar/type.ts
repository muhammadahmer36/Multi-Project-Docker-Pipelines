import { Nullable } from 'types/common';

export interface ConnectivityState {
    offline: Nullable<boolean>;
    showInternetRestoredSnackbar: boolean;
  }
