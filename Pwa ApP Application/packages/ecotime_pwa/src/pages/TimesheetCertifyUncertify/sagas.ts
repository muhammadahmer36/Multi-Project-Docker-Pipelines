/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { TIMESHEET_CERTIFY_UNCERTIFY } from 'appConstants';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { Params, genericGet } from 'utilities';
import { getLastDateOfSpecificMonth } from 'core/utils';
import {
  getTimesheetCertifyUncertifyList,
  setCertifyList,
  setDate,
  setUncertifyList,
} from './slice';
import {
  TimesheetListPayload,
} from './types';
import { getDate } from './selectors';

export function* getTimesheet(action: PayloadAction<TimesheetListPayload>): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const { date } = action.payload;
    const MakeBalanceCategoryPayload: Params = {
      date,
    };
    const response = yield call(genericGet, TIMESHEET_CERTIFY_UNCERTIFY, undefined, true, MakeBalanceCategoryPayload);
    const { list } = response;
    const { isSuccessfull, data } = list;
    if (isSuccessfull && data) {
      const {
        certifyList,
        unCertifyList,
      } = data;

      yield put(setCertifyList(certifyList));
      yield put(setUncertifyList(unCertifyList));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* dateChange(): Generator<Effect, void, any> {
  const date = yield select(getDate);
  const dateWithLastMonth = yield call(getLastDateOfSpecificMonth, date);
  yield put(getTimesheetCertifyUncertifyList({ date: dateWithLastMonth }));
}

export default function* root(): Generator<Effect, void, any> {
  yield takeLatest(getTimesheetCertifyUncertifyList.type, getTimesheet);
  yield takeLatest(setDate.type, dateChange);
}
