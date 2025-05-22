/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { genericGet } from 'utilities';
import { ApiStatusCode, BALANCE_CATEGORIES } from 'appConstants';
import { getBalances } from 'pages/dashboard/selectors';
import { showLoader, hideLoader } from 'core/components/Loader/slice';
import {
  getCategories,
  setBalanceCategories,
  setBalanceGroupDetails,
  setHeaderInfo,
} from './slice';

export function* getCategoriesSaga(action: any): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const balances = yield select(getBalances);
    const { resourceId } = balances;
    const { date, balanceGroupId, employeeNumber } = action.payload;
    const MakeCategoryPayload: Record<string, string> = {
      resourceId,
      employeeNumber,
      asOfDate: date,
      balanceGroupId,
    };
    const response = yield call(genericGet, BALANCE_CATEGORIES, undefined, true, MakeCategoryPayload);
    const { list, status } = response;
    const { isSuccessfull, data } = list;
    const { balanceGroupSummary, balanceGroupDetails, headerInfo } = data;
    if (balanceGroupSummary && status === ApiStatusCode.Success && isSuccessfull) {
      yield put(setBalanceCategories(balanceGroupSummary));
      yield put(setBalanceGroupDetails(balanceGroupDetails));
      yield put(setHeaderInfo(headerInfo));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}
export default function* categoryRootSaga(): Generator<Effect, void, any> {
  yield takeLatest(getCategories.type, getCategoriesSaga);
}
