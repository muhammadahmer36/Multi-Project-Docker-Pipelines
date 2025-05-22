import {
  configureStore, PreloadedState,
} from '@reduxjs/toolkit';
import { reducer } from 'redux/reducer';

export const setupStore = (preloadedState: PreloadedState<object>) => configureStore({
  reducer,
  preloadedState,
});

export default setupStore;
