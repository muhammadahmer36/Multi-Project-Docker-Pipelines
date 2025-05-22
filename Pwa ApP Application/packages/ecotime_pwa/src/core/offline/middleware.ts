import { enqueue } from 'core/offline/slice';
import {
  Dispatch,
  Middleware,
  MiddlewareAPI,
  Action,
} from '@reduxjs/toolkit';
import { getOnline } from './selectors';
import { Configuration } from './types';

const createOfflineMiddleware = (configuration: Configuration):
Middleware => (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  const { getState } = store;
  const { type } = action;
  const deviceOnline: boolean = getOnline(getState());
  const { persistedActions } = configuration;

  if (!deviceOnline && persistedActions.includes(type)) {
    return next(enqueue(action));
  }

  return next(action);
};

export default createOfflineMiddleware;
