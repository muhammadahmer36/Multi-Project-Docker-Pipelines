import {
  configureStore,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import createOfflineMiddleware from 'core/offline/middleware';
import {
  FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore,
} from 'reduxjs-toolkit-persist';
import { timePunch } from 'pages/dashboard/TimePunches/slice';
import { postAdditionalDataForm } from 'pages/AdditionalData/slice';
import { notifyGeofenceRestrictiveActivity } from 'core/geolocation/slice';
import { reducer } from '../reducer';
import watchEcoTime from '../sagas';

const configuration = {
  persistedActions: [timePunch.type, postAdditionalDataForm.type, notifyGeofenceRestrictiveActivity.type],
};
const sagaMiddleware = createSagaMiddleware();
const offlineMiddleware = createOfflineMiddleware(configuration);

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
      ],
      ignoredActionPaths: ['payload.navigate'],
    },
  })
    .concat(offlineMiddleware, sagaMiddleware),
});

sagaMiddleware.run(watchEcoTime);
export default store;
export const persistedStore = persistStore(store);
