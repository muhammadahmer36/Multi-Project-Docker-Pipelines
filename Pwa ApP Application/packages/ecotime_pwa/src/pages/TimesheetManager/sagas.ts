/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from 'core/geolocation/slice';
import {
  Effect, call, put, select, takeLatest,
} from 'redux-saga/effects';
import { TimesheetActionParams } from 'pages/Timesheet/types';
import { genericPost } from 'utilities';
import { ResourceIds } from 'pages/dashboard/types';
import { TIMESHEET_ACTION } from 'appConstants';
import { getTimesheetSearchResult } from 'pages/TimesheetSearchManager/slice';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { getPayPeriod } from 'pages/TimesheetSearchManager/selectors';
import { getTimesheetList } from 'pages/Timesheet/slice';
import { TimesheetActionPayload } from './types';
import { setCheck, setCheckedItems, timesheetAction } from './slice';
import { getCheckedItems } from './selectors';

export function* timesheetActions(action: PayloadAction<TimesheetActionPayload>): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const { code: periodIdentity } = yield select(getPayPeriod);
    const { actionId, listOfEmployeeNumbers } = action.payload;
    const makeBalanceCategoryPayload: TimesheetActionParams = {
      resourceId: ResourceIds.TimeSheet,
      periodIdentity,
      actionId,
      listOfEmployeeNumbers,
      separator: '|',
    };
    const response = yield call(genericPost, TIMESHEET_ACTION, makeBalanceCategoryPayload, undefined, true);
    const { isSuccessfull, data } = response;
    if (isSuccessfull) {
      const checkItems = yield select(getCheckedItems);
      yield put(setCheckedItems(new Array(checkItems.length).fill(false)));
      yield put(getTimesheetSearchResult({}));
      yield put(setCheck(false));
      yield put(openPopup({
        message: data.statusMessage,
        severity: Severity.SUCCESS,
      }));
      if (listOfEmployeeNumbers.includes('|') === false) {
        const employeeNumber = listOfEmployeeNumbers;
        yield put(getTimesheetList({
          periodIdentity: Number(periodIdentity),
          employeeNumber: Number(employeeNumber),
        }));
      }
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}
export default function* root(): Generator<Effect, void, any> {
  yield takeLatest(timesheetAction.type, timesheetActions);
}
