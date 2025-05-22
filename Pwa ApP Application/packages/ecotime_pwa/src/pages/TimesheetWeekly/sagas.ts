/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { TIMESHEET_WEEKLY } from 'appConstants';
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
import { toLocaleDateString } from 'core/utils';
import { ListItem } from 'components/DropDown/types';
import {
  getTimesheetWeeklyList,
  setCalculated,
  setCalculatedList,
  setWeekList,
  setReported,
  setReportedList,
  setWeek,
  setTimeSheet,
  setWeeks,
  setGroupTitle,
} from './slice';
import {
  Calculated,
  Reported,
  TimesheetCalculatedData,
  TimesheetInputData,
  TimesheetListPayload,
  Week,
} from './types';
import {
  getGroupTitle, getTimesheet as getTimesheetWeekly, getWeek, getWeekList, getWeeks,
} from './selectors';

export const transformedReportedListData = (timesheetInputData: TimesheetInputData []) => {
  const reportedList: Reported[] = [];
  const data = timesheetInputData.reduce((acc:Reported[], entry: TimesheetInputData) => {
    const existingEntry = acc.find((item: Reported) => item.groupTitle === entry.groupTitle);
    if (existingEntry) {
      existingEntry.duration += parseFloat(entry.duration);
      existingEntry.payCodeNameList.push(entry);
    } else {
      acc.push({
        weekNum: entry.weekNum,
        groupTitle: entry.groupTitle,
        duration: parseFloat(entry.duration),
        payCodeNameList: [entry],
        errorDescription: entry.errorDescription,
        errorExists: entry.errorExists,
      });
    }
    return acc;
  }, reportedList);

  const formattedGroupDuration = data.map(({ duration, ...rest }) => ({
    ...rest,
    payCodeNameList: duration > 0 ? rest.payCodeNameList : [],
    duration: duration.toFixed(2),
  }));

  return formattedGroupDuration;
};

export const transformedCalculatedListData = (timesheetInputData: TimesheetCalculatedData[]) => {
  const reportedList: Calculated[] = [];
  const data = timesheetInputData.reduce((acc:Calculated[], entry: TimesheetCalculatedData) => {
    const existingEntry = acc.find((item: Calculated) => item.groupTitle === entry.groupTitle);
    if (existingEntry) {
      existingEntry.duration += parseFloat(entry.duration);
      existingEntry.payCodeNameList.push(entry);
    } else {
      acc.push({
        weekNum: entry.weekNum,
        groupTitle: entry.groupTitle,
        duration: parseFloat(entry.duration),
        payCodeNameList: [entry],
      });
    }
    return acc;
  }, reportedList);

  const formattedGroupDuration = data.map(({ duration, ...rest }) => ({
    ...rest,
    payCodeNameList: duration > 0 ? rest.payCodeNameList : [],
    duration: duration.toFixed(2),
  }));

  return formattedGroupDuration;
};

export const transformedWeekListData = (weeks: Week[]) => {
  const transformedData = weeks.map(({ week_Title: weekTitle, weekNum }: Week) => ({
    fldId: weekNum,
    code: weekNum.toString(),
    description: weekTitle,
  }));

  return transformedData;
};

export const getTotalDuration = (data: (TimesheetInputData | TimesheetCalculatedData)[]) => {
  const totalDuration = data.reduce(
    (
      acc: number,
      entry: TimesheetInputData | TimesheetCalculatedData,
    ) => acc + parseFloat(entry.duration || '0'),
    0,
  );
  return totalDuration.toFixed(2);
};

export function* setInitialWeek(): Generator<Effect, void, any> {
  const groupTitle = yield select(getGroupTitle);
  const weeks = yield select(getWeeks);
  const weekList = yield select(getWeekList);
  if (groupTitle && weekList.length > 0) {
    const [startDate, endDate] = groupTitle.split('-');
    const weekStartLocaleDate = toLocaleDateString(startDate);
    const weekEndLocaleDate = toLocaleDateString(endDate);
    const selectedWeek = weeks.filter(({
      weekStartDate,
      weekEndDate,
    }: Week) => {
      const itemStartDate = toLocaleDateString(weekStartDate);
      const itemEndDate = toLocaleDateString(weekEndDate);
      const item = itemStartDate === weekStartLocaleDate && itemEndDate === weekEndLocaleDate;
      return item;
    });
    if (selectedWeek.length > 0) {
      const [w] = selectedWeek;
      const selectedItem = weekList.find((item: ListItem) => item.code === w.weekNum.toString());
      yield put(setWeek(selectedItem));
      yield put(setGroupTitle(''));
    }
  }
}

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
    const response = yield call(genericGet, TIMESHEET_WEEKLY, undefined, true, MakeBalanceCategoryPayload);
    const { list } = response;
    const { isSuccessfull, data } = list;
    if (isSuccessfull && data) {
      const {
        timesheetInputData,
        timesheetCalculatedData,
        weeks,
      } = data;
      const transformedReportedList = yield call(transformedReportedListData, timesheetInputData);
      const transformedCalculatedList = yield call(transformedCalculatedListData, timesheetCalculatedData);
      const transformedWeekList = yield call(transformedWeekListData, weeks);
      yield put(setTimeSheet(data));
      yield put(setCalculatedList(transformedCalculatedList));
      yield put(setReportedList(transformedReportedList));
      yield put(setWeekList(transformedWeekList));
      yield put(setWeeks(weeks));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* filteringTimesheetByWeek(): Generator<Effect, void, any> {
  const { code } = yield select(getWeek);
  const { timesheetInputData, timesheetCalculatedData } = yield select(getTimesheetWeekly);
  const transformedReportedList = yield call(transformedReportedListData, timesheetInputData);
  const transformedCalculatedList = yield call(transformedCalculatedListData, timesheetCalculatedData);
  const filteredCalculatedList = transformedCalculatedList.filter((item: Calculated) => item.weekNum === Number(code));
  const filteredReportedList = transformedReportedList.filter((item: Reported) => item.weekNum === Number(code));
  const totatReportedHours = yield call(getTotalDuration, filteredReportedList);
  const totatCalculatedHours = yield call(getTotalDuration, filteredCalculatedList);
  yield put(setCalculated(totatCalculatedHours));
  yield put(setReported(totatReportedHours));
  yield put(setCalculatedList(filteredCalculatedList));
  yield put(setReportedList(filteredReportedList));
}

export default function* root(): Generator<Effect, void, any> {
  yield takeLatest(getTimesheetWeeklyList.type, getTimesheet);
  yield takeLatest(setWeek.type, filteringTimesheetByWeek);
  yield takeLatest(setGroupTitle.type, setInitialWeek);
}
