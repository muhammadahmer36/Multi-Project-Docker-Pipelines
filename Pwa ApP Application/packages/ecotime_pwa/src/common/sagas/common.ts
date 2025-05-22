/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  takeLatest,
  debounce,
} from 'redux-saga/effects';
import { genericGet, getUpdatedListForDropDown } from 'utilities';
import {
  AuthenticationMethods, EMPLOYEE_LIST, GET_AUTHENTICATION_TYPE, TIMESHEET_GROUPS,
} from 'appConstants';
import {
  getAuthenticationType, setAuthenticationType, getEmployeesOfManger, setEmployeeList,
  setTimsheetGroups,
  getTimesheetGroups,
  setDropDownLoader,
} from 'common/slice/common';
import { showLoader, hideLoader } from 'core/components/Loader/slice';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { AuthenticationTypePayload, EmployeeListPayload, TimeSheetGroupPayload } from 'common/types/types';

function checkValidAuthenticationMode(value: number) {
  const isAuthenticationMethodValid = value in AuthenticationMethods;
  return isAuthenticationMethodValid;
}

export function* getAuthenticationTypeSaga(action: AuthenticationTypePayload): Generator<Effect, void, any> {
  yield put(showLoader());
  try {
    const response = yield call(genericGet, GET_AUTHENTICATION_TYPE, undefined, true);
    const { list } = response;
    const { payload: authenticationMessage } = action;
    const { data, isSuccessfull, statusMessage } = list;
    if (data && isSuccessfull) {
      const { authenticationTypeId } = data;
      const validAuthenticationMethod = checkValidAuthenticationMode(authenticationTypeId);
      if (validAuthenticationMethod) {
        yield put(setAuthenticationType(authenticationTypeId));
      } else {
        yield put(openPopup({
          message: authenticationMessage,
          severity: Severity.ERROR,
        }));
      }
    } else {
      yield put(openPopup({
        message: statusMessage,
        severity: Severity.ERROR,
      }));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* getEmployeesOfManagerSaga(action: EmployeeListPayload): Generator<Effect, void, any> {
  try {
    const { payload } = action;
    const { resourceId, searchString } = payload;
    const QueryParams: Record<string, string> = {
      resourceId,
      searchString,
    };
    const response = yield call(genericGet, EMPLOYEE_LIST, undefined, true, QueryParams);
    const { list: { data: { employeeSearchItems } } } = response;
    if (Array.isArray(employeeSearchItems)) {
      const employeeList = getUpdatedListForDropDown(employeeSearchItems, 'empNo', 'employeeName');
      yield put(setDropDownLoader(false));
      yield put(setEmployeeList(employeeList));
    } else {
      yield put(setEmployeeList([]));
    }
  } catch (error) {
    // will integrate sentry
  }
}

export function* getTimesheetGroupSaga(action: TimeSheetGroupPayload): Generator<Effect, void, any> {
  yield put(showLoader());
  try {
    const { payload } = action;
    const QueryParams: Record<string, string> = {
      resourceId: payload,
    };
    const response = yield call(genericGet, TIMESHEET_GROUPS, undefined, true, QueryParams);
    const { list: { data: { timesheetGroups } } } = response;
    if (Array.isArray(timesheetGroups)) {
      const timesheetEmployeeGroups = getUpdatedListForDropDown(timesheetGroups, 'groupId', 'groupTitle');
      yield put(setTimsheetGroups(timesheetEmployeeGroups));
    } else {
      yield put(setTimsheetGroups([]));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export default function* commonRootSaga(): Generator<Effect, void, any> {
  yield takeLatest(getAuthenticationType.type, getAuthenticationTypeSaga);
  yield debounce(300, getEmployeesOfManger.type, getEmployeesOfManagerSaga);
  yield takeLatest(getTimesheetGroups.type, getTimesheetGroupSaga);
}
