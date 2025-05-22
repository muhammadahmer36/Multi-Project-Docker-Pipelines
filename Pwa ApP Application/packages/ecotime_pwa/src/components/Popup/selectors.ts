import { RootState } from 'redux/reducer';

export const getVisible = (state: RootState) => state.popup.visible;
export const getConfiguration = (state: RootState) => state.popup.configuration;
