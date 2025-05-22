/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GET_TIMESHEET_SEARCH_PARAM, GET_TIMESHEET_SEARCH_RESULT, timesheetManager,
} from 'appConstants';
import { ListItem } from 'components/DropDown/types';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { ResourceIds } from 'pages/dashboard/types';
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { genericGet, genericPost } from 'utilities';
import { setEmployeeDetail } from 'pages/TimesheetManager/slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { PayPeriod, TimesheetSearchParamsPayload } from 'pages/Timesheet/types';
import i18next from 'i18next';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import {
  setPayPeriod as setPayPeriodManager,
} from 'pages/TimesheetManager/slice';
import {
  getPayPeriod,
  getSelectedEmployeeGroup, getSelectedEmployeeList, getSelectedSearchStatusList,
} from './selectors';
import {
  getTimesheetSearchParam, getTimesheetSearchResult, setDefaultPayPeriod, setPayPeriod, setPayPeriodList, setSearchStatusList,
} from './slice';
import { TimesheetSearchResultPayload } from './types';

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

export function* getTimesheetSearchParams(action: PayloadAction<TimesheetSearchParamsPayload>): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const { resourceId, groupId } = action.payload;
    const makeBalanceCategoryPayload = {
      resourceId,
      groupId,
    };
    const response = yield call(genericGet, GET_TIMESHEET_SEARCH_PARAM, undefined, true, makeBalanceCategoryPayload);

    const { list } = response;
    const { data, isSuccessfull } = list;
    const { searchStatuses, payPeriods } = data;
    if (isSuccessfull) {
      const transformedPayPeriodsList = yield call(transformedPayPeriodListData, payPeriods);
      const payPeriod = yield call(getSelectedPayPeriod, payPeriods);
      yield put(setPayPeriodList(transformedPayPeriodsList));
      yield put(setPayPeriod(payPeriod));
      yield put(setDefaultPayPeriod(payPeriod));
      yield put(setSearchStatusList(searchStatuses));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* ListOfEmployeeNumbers(): Generator<Effect, any, any> {
  const selectedEmployeeList = yield select(getSelectedEmployeeList);
  if (selectedEmployeeList.length > 0) {
    const employeeNumbers = selectedEmployeeList.map((item: ListItem) => item.code).join('|');
    return employeeNumbers;
  }
  return '';
}

export function* getTimesheetSearchResults(action:PayloadAction<TimesheetSearchResultPayload>): Generator<Effect, void, any> {
  const { navigate } = action.payload;
  const payPeriod = yield select(getPayPeriod);
  const listOfEmployeeNumbers = yield call(ListOfEmployeeNumbers);
  const selectedSearchStatusList = yield select(getSelectedSearchStatusList);
  const selectedEmployeeGroup = yield select(getSelectedEmployeeGroup);
  const { code: periodIdentity } = payPeriod;

  try {
    yield put(showLoader());
    const timesheetSearchResultParams = {
      ResourceId: ResourceIds.TimeSheet,
      PeriodIdentity: periodIdentity,
      ListOfEmployeeNumbers: listOfEmployeeNumbers,
      ListOfStatusCodes: selectedSearchStatusList.join('|'),
      StatusCodesCondition: 'OR',
      Separator: '|',
      groupId: selectedEmployeeGroup.code.toString(),
    };
    const response = yield call(genericPost, GET_TIMESHEET_SEARCH_RESULT, timesheetSearchResultParams, undefined, true);

    const { data, isSuccessfull } = response;
    const { employeeDetails } = data;
    if (isSuccessfull && employeeDetails) {
      if (employeeDetails.length > 0) {
        yield put(setEmployeeDetail(employeeDetails));
        if (navigate) {
          yield put(setPayPeriodManager(payPeriod));
          navigate(timesheetManager);
        }
      } else if (navigate && employeeDetails.length === 0) {
        const translation = i18next.t('noTimesheetContent');
        yield put(openPopup({
          message: translation,
          severity: Severity.ERROR,
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
  yield takeLatest(getTimesheetSearchParam.type, getTimesheetSearchParams);
  yield takeLatest(getTimesheetSearchResult.type, getTimesheetSearchResults);
}
