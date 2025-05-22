/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { Params, genericGet, genericPost } from 'utilities';
import { getAppInformation } from 'pages/dashboard/selectors';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { ResourceIds } from 'pages/dashboard/types';
import { TIMESHEET, TIMESHEET_ACTION } from 'appConstants';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { ListItem } from 'components/DropDown/types';
import { getTimesheetSearchResult } from 'pages/TimesheetSearchManager/slice';
import { getTimesheetWeeklyList } from 'pages/TimesheetWeekly/slice';
import {
  Calculated,
  PayPeriod,
  Reported,
  TimesheetActionParams,
  TimesheetActionPayload,
  TimesheetCalculatedData,
  TimesheetInputData,
  TimesheetListPayload,
} from './types';
import {

  calculateTimesheet,
  certifyTimesheet,
  getTimesheetList,
  setCalculated,
  setCalculatedList,
  setPayPeriod,
  setPayPeriodList,
  setPayPeriodSummary,
  setEmployeeInformation,
  setReported,
  setReportedList,
  setTimeSheet,
  setUserRole,
} from './slice';
import { getPayPeriod } from './selectors';

export const transformedReportedListData = (timesheetInputData: TimesheetInputData []) => {
  const reportedList: Reported[] = [];
  const data = timesheetInputData.reduce((acc:Reported[], entry: TimesheetInputData) => {
    const existingEntry = acc.find((item: Reported) => item.groupTitle === entry.groupTitle);
    if (existingEntry) {
      existingEntry.duration += parseFloat(entry.duration);
      existingEntry.payCodeNameList.push(entry);
    } else {
      acc.push({
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

export const transformedPayPeriodListData = (payPeriod: PayPeriod[]) => {
  // eslint-disable-next-line camelcase
  const data = payPeriod.map(({ payPeriod_Title, periodIdentity }: PayPeriod) => ({
    fldId: periodIdentity,
    code: periodIdentity.toString(),
    // eslint-disable-next-line camelcase
    description: payPeriod_Title,
  }));

  return data;
};

export const getSelectedPayPeriod = (payPeriod: PayPeriod[]): ListItem => {
  if (payPeriod.length === 0) {
    return { } as ListItem;
  }
  const selectedPeriod = payPeriod.find(({ selectedPayPeriod }) => selectedPayPeriod) ?? payPeriod[0];
  const { periodIdentity, payPeriod_Title: payPeriodTitle } = selectedPeriod;
  return {
    fldId: periodIdentity,
    code: periodIdentity.toString(),
    description: payPeriodTitle,
  };
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

const getEmployeeInformation = (htmlString: string) => {
  const regex = /<span class="cs566403DE">(.*?)<\/span>/g;
  const contentArray: string[] = [];
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(htmlString)) !== null) {
    // Match found, extract the content (group 1)
    const content = match[1];
    contentArray.push(content);
  }
  if (contentArray.length > 0) {
    return contentArray;
  }

  return [];
};
export function* getTimesheet(action: PayloadAction<TimesheetListPayload>): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const applicationInformation = yield select(getAppInformation);
    const {
      periodIdentity, employeeNumber, navigate, route,
    } = action.payload;
    const { userEmpNo } = applicationInformation;
    const MakeBalanceCategoryPayload: Params = {
      resourceId: ResourceIds.TimeSheet,
      employeeNumber: employeeNumber || userEmpNo,
      periodIdentity,
    };
    const response = yield call(genericGet, TIMESHEET, undefined, true, MakeBalanceCategoryPayload);
    const { list } = response;
    const { isSuccessfull, data } = list;
    const {
      applicationInfo, resourceInfo,
      payPeriodSummary, timesheetInputData, timesheetCalculatedData, payPeriods, actions,
    } = data;
    if (isSuccessfull
      && applicationInfo
      && resourceInfo
      && payPeriodSummary
      && timesheetInputData
      && timesheetCalculatedData
       && payPeriods
       && actions) {
      const {
        timesheetInputData,
        timesheetCalculatedData,
        payPeriods,
        payPeriodSummary,
        resourceInfo,
      } = data;
      const transformedReportedList = yield call(transformedReportedListData, timesheetInputData);
      const transformedCalculatedList = yield call(transformedCalculatedListData, timesheetCalculatedData);
      const transformedPayPeriodsList = yield call(transformedPayPeriodListData, payPeriods);
      const payPeriod = yield call(getSelectedPayPeriod, payPeriods);
      const totatReportedHours = yield call(getTotalDuration, timesheetInputData);
      const totatCalculatedHours = yield call(getTotalDuration, timesheetCalculatedData);
      const employeeInformation = yield call(getEmployeeInformation, resourceInfo.header);
      yield put(setReported(totatReportedHours));
      yield put(setCalculatedList(transformedCalculatedList));
      yield put(setCalculated(totatCalculatedHours));
      yield put(setReportedList(transformedReportedList));
      yield put(setPayPeriodList(transformedPayPeriodsList));
      yield put(setPayPeriod(payPeriod));
      yield put(setPayPeriodSummary(payPeriodSummary));
      yield put(setEmployeeInformation(employeeInformation));
      yield put(setTimeSheet(data));
      yield put(setUserRole(resourceInfo.userRoles));
      if (periodIdentity === 0) {
        yield put(getTimesheetWeeklyList({
          periodIdentity: payPeriod.fldId,
          employeeNumber: employeeNumber || userEmpNo,
        }));
      }
      if (navigate && route) {
        navigate(route);
      }
    } else {
      yield put(openPopup({
        message: 'No access to the requested application resource.',
        severity: Severity.ERROR,
      }));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* timesheetAction(action: PayloadAction<TimesheetActionPayload>): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const applicationInformation = yield select(getAppInformation);
    const { code: periodIdentity } = yield select(getPayPeriod);
    const { userEmpNo } = applicationInformation;
    const { actionId, employeeNumber } = action.payload;
    const makeBalanceCategoryPayload: TimesheetActionParams = {
      resourceId: ResourceIds.TimeSheet,
      periodIdentity,
      actionId,
      listOfEmployeeNumbers: employeeNumber || userEmpNo as string,
      separator: null,
    };
    const response = yield call(genericPost, TIMESHEET_ACTION, makeBalanceCategoryPayload, undefined, true);
    const { isSuccessfull, data } = response;
    const { statusMessage } = data;
    if (isSuccessfull) {
      yield put(openPopup({
        message: statusMessage,
        severity: Severity.SUCCESS,
      }));
      if (employeeNumber) {
        yield put(getTimesheetSearchResult({}));
      }
      yield put(getTimesheetList({
        periodIdentity,
        employeeNumber: employeeNumber || userEmpNo,
      }));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}
export default function* root(): Generator<Effect, void, any> {
  yield takeLatest(getTimesheetList.type, getTimesheet);
  yield takeLatest(certifyTimesheet.type, timesheetAction);
  yield takeLatest(calculateTimesheet.type, timesheetAction);
}
