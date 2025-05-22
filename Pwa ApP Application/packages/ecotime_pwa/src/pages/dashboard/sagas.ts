/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Effect, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  setBalances,
  setDashboardItems,
  setTimeOff,
  setTimePunches,
  setTimeSheet,
} from './slice';
import { DashboardItem, ResourceIds } from './types';

function* dashboardHandler(action: PayloadAction<DashboardItem[]>): Generator<Effect, void, any> {
  const dashboardItems: DashboardItem[] = action.payload;
  let balance = null;
  let timePunches = null;
  let timeOff = null;
  let timeSheet = null;

  for (const item of dashboardItems) {
    switch (item.resourceId) {
      case ResourceIds.Balance:
        balance = item;
        break;
      case ResourceIds.TimePunch:
        timePunches = item;
        break;
      case ResourceIds.TimeOff:
        timeOff = item;
        break;
      case ResourceIds.TimeSheet:
        timeSheet = item;
        break;
      default:
        break;
    }
  }
  yield put(setBalances(balance));
  yield put(setTimePunches(timePunches));
  yield put(setTimeOff(timeOff));
  yield put(setTimeSheet(timeSheet));
}

export default function* root(): Generator<Effect, void, any> {
  yield takeLatest(setDashboardItems.type, dashboardHandler);
}
