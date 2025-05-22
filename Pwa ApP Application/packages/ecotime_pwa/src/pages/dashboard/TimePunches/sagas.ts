/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  takeLatest,
  select,
} from 'redux-saga/effects';
import { genericGet, genericPost } from 'utilities';
import {
  ValidationStatusCodes,
  getClockComponent,
  addPunches,
  ApiStatusCode,
} from 'appConstants';
import { ApiResponse } from 'types/api';
import {
  convertToTimestamp, ensuredUTCFormat, getBrowserName, getCurrentTimeOffset, getTimeZoneAbbreviation,
} from 'core/utils';
import { setRunningClock, setRunningClockDBServerGMT } from 'core/runningClockSyncing/slice';
import { openPopup } from 'components/Popup/slice';
import { updateAdditionalInformationOfPunchType } from 'pages/AdditionalData/sagas';
import { Severity } from 'components/SnackBar/types';
import { getCoordinates } from 'core/geolocation/selectors';
import {
  setTimeIn,
  setTransfer,
  timePunch,
  setTimeOut,
  timePunchingComponents,
  setNextPunch,
  setLastPunch,
  setDateTimeUTC,
  setClockComponentItems,
  setShowLoader,
} from './slice';
import {
  ClockWidgetItem,
  ClockWidgetResponse,
  TimePunch,
  MakePunchPayload,
  PayloadActionTimePunch,
} from './types';
import { getTimeIn } from './selector';
import { ApplicationInfo, DateTimeFormats } from '../types';
import { setAppInformation, setDashboardItems, setTimeAndDateInformation } from '../slice';

export function* timePunchingComponentsMapper(items: ClockWidgetItem[]): Generator<Effect, void, any> {
  const { TimeIn, TimeOut, Transfer } = TimePunch;
  let timeInComponent = null;
  let timeOutComponent = null;
  let transferComponent = null;

  for (const item of items) {
    const { functionId, functionNextExpected } = item;
    switch (functionId) {
      case TimeIn:
        timeInComponent = item;
        if (functionNextExpected) {
          yield put(setNextPunch(TimeIn));
        }
        break;
      case TimeOut:
        timeOutComponent = item;
        yield put(setTimeOut(item));
        if (functionNextExpected) {
          yield put(setNextPunch(TimeOut));
        }
        break;
      case Transfer:
        transferComponent = item;
        yield put(setTransfer(item));
        break;
      default:
        break;
    }
  }

  yield put(setTimeIn(timeInComponent));
  yield put(setTimeOut(timeOutComponent));
  yield put(setTransfer(transferComponent));
}

function* handleSuccessResponse(response: ClockWidgetResponse): Generator<Effect, void, any> {
  const { clockWidgetItems, lastPunch, utcDateTime } = response;
  yield put(setClockComponentItems(clockWidgetItems));
  yield call(timePunchingComponentsMapper, clockWidgetItems);
  yield put(setLastPunch(lastPunch));
  yield put(setDateTimeUTC(utcDateTime));
  const ensuredDateTimeUTC = ensuredUTCFormat(utcDateTime);
  const timeStampDateTimeUTC = convertToTimestamp(ensuredDateTimeUTC);
  yield put(setRunningClock(timeStampDateTimeUTC));
  const { dbServerGMT } = yield select(getTimeIn);
  if (dbServerGMT) {
    const ensuredDBServerGMTUTC = ensuredUTCFormat(dbServerGMT);
    const timeStampDBServerGMT = convertToTimestamp(ensuredDBServerGMTUTC);
    yield put(setRunningClockDBServerGMT(timeStampDBServerGMT));
  }
}

function* saveTimeAndDateConfiguration(dateTimeFormats: DateTimeFormats): Generator<Effect, void, any> {
  const {
    dateTimeFormatClockWidget,
    dateFormat,
    dateTimeFormat,
    timeFormat,
  } = dateTimeFormats;
  const timeAndDateConfiguration = {
    dateTimeFormatClockWidget,
    dateFormat,
    dateTimeFormat,
    timeFormat,
  };
  yield put(setTimeAndDateInformation(timeAndDateConfiguration as DateTimeFormats));
}

export function* postTimePunch(action: PayloadActionTimePunch): Generator<Effect, void, any> {
  const { Transfer } = TimePunch;
  const { PunchSuccess } = ValidationStatusCodes;
  const { payload, timeStamp } = action;
  const {
    time, punch, dbServerGMT, uniqueId, isOfflinePunch,
  } = payload;
  if (!timeStamp) {
    yield put(setShowLoader(true));
  }
  const coordinates = yield select(getCoordinates);
  const location = coordinates != null
    ? `${getTimeZoneAbbreviation()} ${JSON.stringify(coordinates)}` : getTimeZoneAbbreviation();
  const MakePunchPayload: MakePunchPayload = {
    functionId: punch,
    UtcTimestamp: time as string,
    timestamp: dbServerGMT,
    clientGuidId: uniqueId,
    isOfflinePunch,
    timeZoneOffset: getCurrentTimeOffset(),
    geoLocation: location,
    source: getBrowserName(),
  };
  try {
    const response = yield call(genericPost, addPunches, MakePunchPayload, undefined, true);
    const {
      status,
      data,
      validation,
    } = response as any;
    const { statusMessage, statusCode } = validation;
    if (data && status === ApiStatusCode.Success) {
      yield call(handleSuccessResponse, data);
      yield call(saveTimeAndDateConfiguration, data.dateTimeFormats);
      yield call(updateAdditionalInformationOfPunchType, data, isOfflinePunch, punch);
    }
    yield put(openPopup({
      message: statusMessage,
      severity: statusCode === PunchSuccess ? Severity.SUCCESS : Severity.ERROR,
    }));
  } catch (error) {
    if (punch !== Transfer) {
      yield put(setNextPunch(punch));
    }
  } finally {
    yield put(setShowLoader(false));
  }
}

export function* getTimePunchingComponents(): Generator<Effect, void, any> {
  try {
    yield put(setShowLoader(true));
    const response = yield call(genericGet, getClockComponent, undefined, true);
    const { list, status } = response;
    const { isSuccessfull } = list;
    if (list && status === ApiStatusCode.Success && isSuccessfull) {
      const { data } = list as ApiResponse<ClockWidgetResponse>;
      const { dateTimeFormats, dashboard } = data;
      const { dashboardItems, applicationInfo } = dashboard;
      yield put(setDashboardItems(dashboardItems));
      yield put(
        setAppInformation(
          applicationInfo as ApplicationInfo,
        ),
      );
      yield call(handleSuccessResponse, data);
      yield call(saveTimeAndDateConfiguration, dateTimeFormats);
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(setShowLoader(false));
  }
}

export default function* rootSaga(): Generator {
  yield takeLatest(timePunch.type, postTimePunch);
  yield takeLatest(timePunchingComponents.type, getTimePunchingComponents);
}
