/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { genericGet, genericPost } from 'utilities';
import {
  ApiStatusCode, TIMESHEET_FETCH_NOTES, TIMESHEET_ADD_NOTES, timesheetNotes,
} from 'appConstants';
import { getAppInformation, getTimeSheet } from 'pages/dashboard/selectors';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { getSelectedTimesheet } from 'pages/TimesheetManager/selectors';
import { getTimesheetUserCurrentRole } from 'pages/Timesheet/selectors';
import { UserRole } from 'common/types/types';
import { getTimesheetSearchResult } from 'pages/TimesheetSearchManager/slice';
import { AddTimesheetNotesPayload, GetTimesheetNotesPayload } from './types';
import {
  addTimesheetNotes, getTimesheetNotes, saveNoteValidationMessage, saveTimesheetNotes,
  setEmployeeNameForMangerNoteView,
  setNoteSuccess,
} from './slice';

export function* getTimesheetNotesSaga(action: GetTimesheetNotesPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timesheet = yield select(getTimeSheet);
    const applicationInformation = yield select(getAppInformation);
    const selectedTimesheet = yield select(getSelectedTimesheet);
    const { resourceId } = timesheet;
    const { payload } = action;
    const { navigate, code: periodIdentity } = payload;
    const { userEmpNo } = applicationInformation;
    const employeeNumber = selectedTimesheet ? selectedTimesheet.empNo : userEmpNo;
    const NotesQueryParams: Record<string, string> = {
      resourceId,
      employeeNumber,
      periodIdentity,
    };
    const response = yield call(genericGet, TIMESHEET_FETCH_NOTES, undefined, true, NotesQueryParams);
    const { list, status } = response;
    const { data: { noteDetails, resourceInfo } } = list;
    if (status === ApiStatusCode.Success) {
      yield put(saveTimesheetNotes(noteDetails));
      yield put(setEmployeeNameForMangerNoteView(resourceInfo?.employeeNameText));
      if (navigate !== undefined) {
        navigate(timesheetNotes);
      }
      if (selectedTimesheet) {
        yield put(getTimesheetSearchResult({}));
      }
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* addTimesheetNotesSaga(action: AddTimesheetNotesPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const { payload: { periodIdentity, note } } = action;
    const applicationInformation = yield select(getAppInformation);
    const timesheetUserCurrentRole = yield select(getTimesheetUserCurrentRole);
    const selectedTimesheet = yield select(getSelectedTimesheet);
    const { userEmpNo } = applicationInformation;
    const employeeNumber = timesheetUserCurrentRole === UserRole.Employee ? userEmpNo : selectedTimesheet?.empNo;

    const addNotesPayload = {
      note,
      periodIdentity,
      employeeNumber,

    };
    const response = yield call(genericPost, TIMESHEET_ADD_NOTES, addNotesPayload, undefined, true);
    const { isSuccessfull, validation } = response;
    const { statusMessage } = validation;
    if (isSuccessfull) {
      yield put(setNoteSuccess(isSuccessfull));
      yield put(showLoader());
      yield put(saveTimesheetNotes([]));
      const getNotesPayload = {
        code: periodIdentity,
      };
      yield put(getTimesheetNotes(getNotesPayload));
      yield put(openPopup({
        message: statusMessage,
        severity: Severity.SUCCESS,
      }));
    } else {
      yield put(hideLoader());
      yield put(saveNoteValidationMessage(statusMessage));
    }
  } catch (error) {
    yield put(hideLoader());
    // will integrate sentry
  }
}

export default function* timesheetNotesRootSaga(): Generator<Effect, void, any> {
  yield takeLatest(getTimesheetNotes.type, getTimesheetNotesSaga);
  yield takeLatest(addTimesheetNotes.type, addTimesheetNotesSaga);
}
