/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import * as turf from '@turf/turf';
import {
  ApiStatusCode,
  NOTIFY_GEOFENCE_RESTRICTION,
  ValidationStatusCodes,
  resoucrceInPolygon,
} from 'appConstants';
import { GeofenceRestriction } from 'common/types/types';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { getAppInformation } from 'pages/dashboard/selectors';
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { Params, genericGet } from 'utilities';
import {
  notifyGeofenceRestrictiveActivity,
  setLocationIsValid,
  setResourceInPolygon,
  validateGeolocation,
} from './slice';
import {
  Coordinates,
  NotifyGeofenceRestriction,
  ResourceInPolygon,
  ValidateGeolocation,
} from './types';

import { getCoordinates, getPolygon as getPolygonList, getResourcesInPolygon } from './selectors';

export function* validatingCoordinatesServer(coordinates: Coordinates): Generator<Effect, void, any> {
  const { latitude, longitude } = coordinates;
  try {
    const params: Record<string, string> = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    };

    const response = yield call(genericGet, resoucrceInPolygon, undefined, true, params);
    const { list, status } = response;
    if (list && status === ApiStatusCode.Success) {
      const { data, validation } = list;
      if (validation && validation.statusCode === ValidationStatusCodes.MissedConfiguredProfile) {
        yield put(openPopup({
          message: validation.statusMessage,
          severity: Severity.ERROR,
        }));
      } else if (validation
        && (validation.statusCode === ValidationStatusCodes.GeofenceTurnOffByAdmin
        || validation.statusCode === ValidationStatusCodes.GeofenceUnAuthorize)) {
        yield put(setResourceInPolygon([]));
      } else if (data && data.length && data.length > 0) {
        yield put(setResourceInPolygon(data));
      }
    }
  } catch (error) {
    // will integrate sentry
  }
}

export function* validatingCoordinatesClient(coordinates: Coordinates): Generator<Effect, void, any> {
  const { latitude, longitude } = coordinates;
  try {
    const polygone = yield select(getPolygonList);

    if (polygone.length > 0) {
      const coordinatesArray = polygone.map((coord: Coordinates) => [coord.longitude, coord.latitude]);

      const linearRing = coordinatesArray.concat([coordinatesArray[0]]);

      const polygon = turf.polygon([linearRing]);

      const locationIsValid = turf.booleanPointInPolygon([longitude, latitude], polygon);

      if (locationIsValid) {
        yield put(setLocationIsValid(true));
      } else {
        yield put(setLocationIsValid(false));
      }
    }
  } catch (error) {
    // will integrate sentry
  }
}

export function* validatingCoordinates(action: PayloadAction<ValidateGeolocation>): Generator<Effect, void, any> {
  const { latitude, longitude, showLoader: showActivityIndicator } = action.payload;
  if (showActivityIndicator) {
    yield put(showLoader());
  }
  try {
    const coordinates = {
      latitude,
      longitude,
    };

    if (navigator.onLine) {
      yield call(validatingCoordinatesServer, coordinates);
    } else {
      // will implement offline geofencing in next sprint.
      // yield call(validatingCoordinatesClient, coordinates);
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* notifyRestrictiveActivity(action: PayloadAction<NotifyGeofenceRestriction>): Generator<Effect, void, any> {
  const { resourceId } = action.payload;
  const resourcesInPolygon = yield select(getResourcesInPolygon);
  const resource = resourcesInPolygon.find((item: ResourceInPolygon) => item.resourceId === resourceId);

  if (resource
    && resource.geofenceMode
    && resource.geofenceMode.id
    && resource.geofenceMode.id === GeofenceRestriction.Warning
    && resource.isLocationValid === false) {
    try {
      const applicationInformation = yield select(getAppInformation);
      const { userEmpNo } = applicationInformation;
      const { latitude, longitude } = yield select(getCoordinates);

      const params: Params = {
        ResourceId: resourceId,
        EmployeeNumber: userEmpNo,
        Latitude: latitude,
        Longitude: longitude,
      };

      yield call(genericGet, NOTIFY_GEOFENCE_RESTRICTION, undefined, true, params);
    } catch (error) {
    // will integrate sentry
    }
  }
}
export default function* rootSaga(): Generator<Effect, void, any> {
  yield takeLatest(validateGeolocation.type, validatingCoordinates);
  yield takeLatest(notifyGeofenceRestrictiveActivity.type, notifyRestrictiveActivity);
  // yield takeLatest(getPolygon, getUserPolygon);
}
