/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { TIMESHEET_DAILY } from 'appConstants';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { getAppInformation } from 'pages/dashboard/selectors';
import { ResourceIds } from 'pages/dashboard/types';
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { Params, genericGet } from 'utilities';
import { getDailyPickerDate } from 'core/utils';
import { getDay, getTimesheetDaily } from './selectors';
import {
  getTimesheetDailyList,
  setDailyDetail,
  setDay,
  setDayList,
  setReportedHours,
  setTimeSheet,
} from './slice';
import {
  DailyItem,
  TimesheetListPayload,
} from './types';

export const transformedDayListData = (weeks: DailyItem[]) => {
  const transformedData = weeks.map(({ tsDate, weekNum }: DailyItem) => ({
    fldId: weekNum,
    code: tsDate,
    description: getDailyPickerDate(tsDate),
  }));

  return transformedData;
};

export function* getTimesheet(action: PayloadAction<TimesheetListPayload>): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const applicationInformation = yield select(getAppInformation);
    const { periodIdentity, employeeNumber } = action.payload;
    const { userEmpNo } = applicationInformation;
    const MakeBalanceCategoryPayload: Params = {
      resourceId: ResourceIds.TimeSheet,
      employeeNumber: employeeNumber || userEmpNo,
      periodIdentity,
    };
    const response = yield call(genericGet, TIMESHEET_DAILY, undefined, true, MakeBalanceCategoryPayload);
    const { list } = response;
    const { isSuccessfull, data } = list;
    if (isSuccessfull && data) {
      const {
        dailyItems,
      } = data;
      const transformedDayList = yield call(transformedDayListData, dailyItems);
      yield put(setTimeSheet(dailyItems));
      yield put(setDayList(transformedDayList));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* filteringTimesheetByDaily(): Generator<Effect, void, any> {
  const { code } = yield select(getDay);
  const timesheetDaily = yield select(getTimesheetDaily);
  const [item] = timesheetDaily.filter((item: DailyItem) => item.tsDate === code);
  yield put(setDailyDetail(item.dailyDetails));
  yield put(setReportedHours(item.reportedHours));
}

export default function* root(): Generator<Effect, void, any> {
  yield takeLatest(getTimesheetDailyList.type, getTimesheet);
  yield takeLatest(setDay.type, filteringTimesheetByDaily);
}
