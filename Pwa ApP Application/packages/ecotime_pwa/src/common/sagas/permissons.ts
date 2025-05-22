/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { genericGet } from 'utilities';
import {
  ApiStatusCode, PERMISSIONS, isGeofencingApplicable,
} from 'appConstants';
import { ApiResponse } from 'types/api';
import { permissions, setPermission, removePermission } from 'common/slice/permissions';
import { GeofecingApplicableResponse } from 'common/types/types';
import { showLoader, hideLoader } from 'core/components/Loader/slice';

export function* getGeofencingPermission(): Generator<Effect, void, any> {
  yield put(showLoader());
  try {
    const response = yield call(genericGet, isGeofencingApplicable, undefined, true);
    const { list, status } = response;
    const { isSuccessfull } = list;
    if (list && status === ApiStatusCode.Success && isSuccessfull) {
      const { data } = list as ApiResponse<GeofecingApplicableResponse>;
      const { isGeofencingApplicable } = data;
      if (isGeofencingApplicable) {
        yield put(setPermission(PERMISSIONS.GEOFENCING));
      } else {
        yield put(removePermission(PERMISSIONS.GEOFENCING));
      }
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export default function* rootSaga(): Generator<Effect, void, any> {
  yield takeLatest(permissions.type, getGeofencingPermission);
}
