/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { checkNullOrUndefined, genericGet } from 'utilities';
import { PUNCH_HISTORY, punchHistoryDayLimitZero } from 'appConstants';
import { getTimePunches } from 'pages/dashboard/selectors';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { ApiStatusCode, ValidationStatusCodes } from 'appConstants';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { getCurrentTimeOffset } from 'core/utils';
import {
  getPunchHistoryList, setPunchHistory, setPunchHistoryDayLimitSearch,
} from './slice';
import { PunchHistory, PunchHistoryPayload, maximumPhunchHistoryDaysLimitation } from './types';

export function* getPunchHistorySaga(action: PunchHistoryPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timePunch = yield select(getTimePunches);
    const timeZoneOffset = getCurrentTimeOffset().toString();
    const { resourceId } = timePunch;
    const { payload } = action;
    const PunchHistoryQueryParams: Record<string, string> = {
      resourceId,
      historyDate: payload[0],
      historyEndDate: payload[1],
      timeZoneOffset,
    };
    const response = yield call(genericGet, PUNCH_HISTORY, undefined, true, PunchHistoryQueryParams);
    const { list, status } = response;
    const { isSuccessfull, data, validation } = list;
    const { statusCode, statusMessage } = validation;
    const { ApiSuccess } = ValidationStatusCodes;
    const { punchHistory, punchHistoryDayLimit } = data;
    const object = { punchHistoryDayLimit };
    if (punchHistory && status === ApiStatusCode.Success && isSuccessfull) {
      if (statusCode === ApiSuccess) {
        const updatedPunchHistory = punchHistory.map((eachPunchHistory: PunchHistory) => ({
          ...eachPunchHistory,
          isExpanded: false,
        }));
        yield put(setPunchHistory(updatedPunchHistory));
        if (checkNullOrUndefined(object) || punchHistoryDayLimit === punchHistoryDayLimitZero) {
          yield put(setPunchHistoryDayLimitSearch(maximumPhunchHistoryDaysLimitation));
        } else {
          yield put(setPunchHistoryDayLimitSearch(punchHistoryDayLimit));
        }
      } else {
        yield put(openPopup({
          message: statusMessage,
          severity: Severity.ERROR,
        }));
        yield put(setPunchHistory([]));
      }
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}
export default function* punchHistoryRootSaga(): Generator<Effect, void, any> {
  yield takeLatest(getPunchHistoryList.type, getPunchHistorySaga);
}
