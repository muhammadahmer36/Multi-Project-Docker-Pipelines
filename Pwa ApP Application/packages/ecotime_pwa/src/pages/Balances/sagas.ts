/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { genericGet } from 'utilities';
import {
  ApiStatusCode, BALANCE_SUMMARY, balanceSearchManager, balances as balanceRoute, dashboard,
  BALANCE_FOR_TIMESHEET_GROUPS,
} from 'appConstants';
import { getAppInformation, getBalances } from 'pages/dashboard/selectors';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { UserRole } from 'common/types/types';
import { NavigateFunction } from 'react-router-dom';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import {
  getBalanceCategories,
  getBalanceForTimesheetGroups,
  saveResourceInformation,
  setBalanceGroupes,
  setBalanceParams,
  setHeaderInfo,
  setUserCurrentRole,
  setUserRole,
} from './slice';
import { BalanceSummaryForTimesheetGroupPayload, BalanceSummaryPayload } from './types';
import { getBalanceUserCurrentRole, getSelectedEmployee, getSelectedTimesheetGroup } from './selectors';

export function* handleNavigationBasedOnRole(
  navigate: NavigateFunction | undefined,
  page: string | undefined,
  userRoles: number,
): Generator<Effect, any, any> {
  if (page === dashboard) {
    if (userRoles === UserRole.Manager) {
      yield put(setUserCurrentRole(UserRole.Manager));
      if (navigate) {
        navigate(balanceSearchManager);
      }
    } else if (navigate) {
      navigate(balanceRoute);
    }
  } else if (page === balanceSearchManager) {
    if (navigate) {
      navigate(balanceRoute);
    }
  }
}

export function* getBalanceCategoriesSaga(action: BalanceSummaryPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());

    const applicationInformation = yield select(getAppInformation);
    const balances = yield select(getBalances);
    const employee = yield select(getSelectedEmployee);
    const currentRole = yield select(getBalanceUserCurrentRole);
    const { resourceId } = balances;
    const { payload } = action;
    const { date, navigate, page } = payload;
    const { userEmpNo } = applicationInformation;
    const MakeBalanceCategoryPayload: Record<string, string> = {
      resourceId,
      employeeNumber: currentRole === UserRole.Manager ? employee.code : userEmpNo,
      asOfDate: date,
    };
    const response = yield call(genericGet, BALANCE_SUMMARY, undefined, true, MakeBalanceCategoryPayload);
    const { list } = response;
    const { isSuccessfull, data, validation } = list;

    if (!isSuccessfull) {
      yield put(openPopup({
        message: validation.statusMessage,
        severity: Severity.ERROR,
      }));
    } else {
      const { groupedBalance, headerInfo, resourceInfo } = data;
      const { userRoles } = resourceInfo;

      yield put(setHeaderInfo(headerInfo));
      yield put(setUserRole(userRoles));
      yield put(setBalanceGroupes(groupedBalance || []));
      yield put(saveResourceInformation(resourceInfo));
      yield call(handleNavigationBasedOnRole, navigate, page, userRoles);
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* getBalanceForTimesheetGroupsSaga(action: BalanceSummaryForTimesheetGroupPayload):
  Generator<Effect, void, any> {
  try {
    yield put(showLoader());

    const balances = yield select(getBalances);
    const timesheetGroup = yield select(getSelectedTimesheetGroup);
    const { resourceId } = balances;
    const { payload } = action;
    const {
      date, navigate, page, pageid,
    } = payload;

    const QueryParams: Record<string, string | number> = {
      balanceGroupId: timesheetGroup.code,
      pageid,
      resourceId,
      asOfDate: date,
    };

    const response = yield call(genericGet, BALANCE_FOR_TIMESHEET_GROUPS, undefined, true, QueryParams);
    const { list, status } = response;
    const { isSuccessfull, data } = list;
    const {
      groupedBalance, headerInfo, resourceInfo, balancesParam,
    } = data;
    const { userRoles } = resourceInfo;

    if (groupedBalance && headerInfo && status === ApiStatusCode.Success && isSuccessfull) {
      yield put(setHeaderInfo(headerInfo));
      yield put(setUserRole(userRoles));
      yield put(setBalanceGroupes(groupedBalance));
      yield put(saveResourceInformation(resourceInfo));
      yield put(setBalanceParams(balancesParam));
      yield call(handleNavigationBasedOnRole, navigate, page, userRoles);
    } else {
      yield put(setBalanceGroupes([]));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export default function* balancesRootSaga(): Generator<Effect, void, any> {
  yield takeLatest(getBalanceCategories.type, getBalanceCategoriesSaga);
  yield takeLatest(getBalanceForTimesheetGroups.type, getBalanceForTimesheetGroupsSaga);
}
