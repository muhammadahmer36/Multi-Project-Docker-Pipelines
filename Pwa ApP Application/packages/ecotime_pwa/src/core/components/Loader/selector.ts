import { RootState } from 'redux/reducer';

export const getLoader = (state: RootState) => state.loader.showLoader;
