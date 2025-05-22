/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import i18next from 'i18next';
import { genericGet, genericPost, getListWithSeperator } from 'utilities';
import {
  FETCH_TIME_OFF, FETCH_TIME_OFF_DETAIL,
  ValidationStatusCodes, NEW_REQUEST_SUMMARY,
  SAVE_TIME_OFF_REQUEST,
  yearMonthDayFormat,
  zeroRequestId,
  TIME_OFF_REQUEST_ACTION,
  TIME_OFF_NOTES,
  ADD_NOTES,
  TimeOfRequestActionFailure,
  timeOffSearch,
  timeOff,
  dashboard,
} from 'appConstants';
import { getAppInformation, getTimeOff } from 'pages/dashboard/selectors';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import { ApiStatusCode } from 'appConstants';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { reviewStatus } from 'pages/TimeOffCalendar/types';
import {
  formatsMapper, getDateAgainstFormat, getDatesRanges,
} from 'core/utils';
import { setSearchConfigurationForTimeOffRequestColors } from 'common/slice/common';
import { UserRole } from 'common/types/types';
import {
  getTimeOffRequests, setApprovedHolidays,
  setSummaryInformation, setTimeOffActions,
  getDetailOfTimeOffRequests,
  setDetailItemsOfTimeOffRequest,
  setSummaryOfDetailItems,
  startTimeOffRequest,
  setPayCodesForDropDownList,
  setNewResquestInformation,
  setExistingRequestIntervals,
  saveTimeOffRequest,
  successSaveTimeOffRequest,
  navigateToSaveTimeffRequest,
  navigateToSaveTimeOffDetailScreen,
  timeOffRequestAction,
  getTimeOffNotes,
  saveNotesDetailOfTimeOffRequest,
  navigateToNotesScreen,
  addTimeOffNotes,
  setUserRole,
  saveNoteValidationMessage,
  setNoteSuccess,
  setListOfReviewStatus,
  setUserCurrentRole,
  setEmployeeNameForMangerNoteView,
  saveActionsTimeOffDetail,
  saveActionsTimeOffNotes,
} from './slice';
import {
  AddTimeOffNotesPayload,
  GetTimeOffNotesPayload, GetTimeOffRequestPayload,
  SaveTimeOffRequestPayload, SummaryInformation, TimeOffRequestActionPayload, TimeOffRequestItemDetail,
} from './types';
import {
  getCurrentMode, getItemDetailOfTimeOffRequests, getListOfEmployees, getListOfReviewStatus,
  getSelectedTimesheetGroup,
} from './selectors';

function* handleTimeOffError(statusMessage: string) {
  yield put(openPopup({
    message: statusMessage,
    severity: Severity.ERROR,
  }));
  yield put(setApprovedHolidays([]));
  yield put(setSummaryInformation([]));
  yield put(setTimeOffActions([]));
}

function* handleNoTimeOffs(page: string, summaryInfo: any[], navigate: any): Generator<Effect, void, any> {
  if (page === timeOffSearch) {
    if (summaryInfo?.length === 0) {
      const translation = i18next.t('noTimeOffContent');
      yield put(openPopup({
        message: translation,
        severity: Severity.ERROR,
      }));
    } else if (navigate) {
      navigate(timeOff);
    }
  }
}

function* handleUserOnDashboard(userRoles: number, navigate: any) {
  if (userRoles === UserRole.Manager) {
    yield put(setUserCurrentRole(UserRole.Manager));

    if (navigate) {
      navigate(timeOffSearch);
    }
  } else if (navigate) {
    navigate(timeOff);
  }
}

function updateSummaryInformation(summaryInfo: SummaryInformation[]) {
  const updatedSummaryInfo = summaryInfo.map((eachSummary: SummaryInformation) => ({
    ...eachSummary,
    isDeleted: false,
    isSelectedForManagerAction: false,
  }));
  return updatedSummaryInfo;
}

export function* getTimeOffRequestsSaga(action: GetTimeOffRequestPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timeOffResource = yield select(getTimeOff);
    const reviewStatuses = yield select(getListOfReviewStatus);
    const employees = yield select(getListOfEmployees);
    const selectedTimesheetGroup = yield select(getSelectedTimesheetGroup);
    const currentRole = yield select(getCurrentMode);
    const { resourceId } = timeOffResource;
    const { payload } = action;
    const { page, navigate } = payload;

    const FetchTimeOffRequestPayload = {
      resourceId,
      date: payload?.date,
      managerMode: currentRole === UserRole.Manager,
      groupId: selectedTimesheetGroup?.code?.toString(),
      listOfEmployeeNumbers: currentRole === UserRole.Manager ? getListWithSeperator(employees) : '',
      listOfReviewStatusCodes: currentRole === UserRole.Manager ? reviewStatuses.join('|') : '',
      separator: '|',
    };

    const response = yield call(genericPost, FETCH_TIME_OFF, FetchTimeOffRequestPayload, undefined, true);
    const {
      data, validation, isSuccessfull, status,
    } = response;

    const {
      summaryInfo, searchConfiguration, actions, resourceInfo,
    } = data;

    const { userRoles } = resourceInfo;
    const { ApiSuccess } = ValidationStatusCodes;
    const { statusCode, statusMessage } = validation;
    if (status === ApiStatusCode.Success && isSuccessfull) {
      if (statusCode === ApiSuccess) {
        if (page === timeOffSearch) {
          yield call(handleNoTimeOffs, page, summaryInfo, navigate);
        }
        let timeOffRequestDates: string[] = [];
        if (Array.isArray(summaryInfo)) {
          const updatedSummaryInformation = yield call(updateSummaryInformation, summaryInfo);
          summaryInfo.forEach(({ startDate, endDate }: { startDate: string; endDate: string }) => {
            const datesArray = getDatesRanges(startDate, endDate);
            timeOffRequestDates = [...timeOffRequestDates, ...datesArray];
          });
          yield put(setSummaryInformation(updatedSummaryInformation));
          yield put(setApprovedHolidays(timeOffRequestDates));
        }
        if (Array.isArray(actions)) {
          yield put(setTimeOffActions(actions));
        }
        yield put(setSearchConfigurationForTimeOffRequestColors(searchConfiguration));
        yield put(setUserRole(userRoles));
        if (page === dashboard) {
          yield call(handleUserOnDashboard, userRoles, navigate);
        }
      } else {
        yield call(handleTimeOffError, statusMessage);
      }
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* getDetailOfTimeOffRequestsSaga(action: GetTimeOffRequestPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timeOffResource = yield select(getTimeOff);
    const applicationInformation = yield select(getAppInformation);
    const { userEmpNo } = applicationInformation;
    const { resourceId } = timeOffResource;
    const { payload } = action;
    const {
      startDate, requestId, endDate, listOfPayCodes, addTimeOff,
    } = payload;
    const timeOffRequestStartDate = getDateAgainstFormat(startDate);
    const timeOffRequestEndDate = getDateAgainstFormat(endDate);

    const TimeOffRequestDetailQueryParams: Record<string, string> = {
      resourceId,
      requestId: requestId.toString(),
      startDate: timeOffRequestStartDate,
      endDate: timeOffRequestEndDate,
      listOfPayCodeIds: listOfPayCodes,
      employeeNumber: userEmpNo,
      separator: '',
    };

    const response = yield call(genericGet, FETCH_TIME_OFF_DETAIL, undefined, true, TimeOffRequestDetailQueryParams);
    const { list, status } = response;
    const { isSuccessfull, data } = list;
    const {
      dailyInfoItems, requestDetailsInfo, resourceInfo, actions,
    } = data;

    if (status === ApiStatusCode.Success && isSuccessfull) {
      yield put(setDetailItemsOfTimeOffRequest(dailyInfoItems));
      yield put(setSummaryOfDetailItems(requestDetailsInfo));
      if (addTimeOff) {
        yield put(navigateToSaveTimeffRequest(true));
      } else {
        yield put(setEmployeeNameForMangerNoteView(resourceInfo?.employeeNameText));
        yield put(saveActionsTimeOffDetail(actions));
        yield put(navigateToSaveTimeOffDetailScreen(true));
      }
    } else {
      yield put(setSummaryOfDetailItems(requestDetailsInfo));
      yield put(setDetailItemsOfTimeOffRequest([]));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* startTimeOffRequestSaga(): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timeOffResource = yield select(getTimeOff);
    const response = yield call(genericGet, NEW_REQUEST_SUMMARY, undefined, true, timeOffResource);
    const { list, status } = response;
    const { isSuccessfull, data } = list;
    const { payCodes, newRequestInfo, existingRequestIntervals } = data;
    if (status === ApiStatusCode.Success && isSuccessfull) {
      const updatedPayCodes = payCodes.map(({ id, payCodeTitle }:
        { id: number; payCodeTitle: string }) => ({
        code: id.toString(),
        description: payCodeTitle,
      }));
      yield put(setPayCodesForDropDownList(updatedPayCodes));
      yield put(setNewResquestInformation(newRequestInfo));
      yield put(setExistingRequestIntervals(existingRequestIntervals));
      //
    } else {
      yield put(setPayCodesForDropDownList([]));
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

const getListsForPayload = (updatedDetailOfTimeOfRequest: TimeOffRequestItemDetail[]) => {
  let listOfDates = '';
  let listOfPayCodeIds = '';
  let listOfDurations = '';

  updatedDetailOfTimeOfRequest.forEach((item: TimeOffRequestItemDetail) => {
    const {
      requestDate, duration1, duration2, payCodeId1, payCodeId2,
    } = item;
    listOfDates += `${getDateAgainstFormat(requestDate, formatsMapper[yearMonthDayFormat])}
    |${getDateAgainstFormat(requestDate, formatsMapper[yearMonthDayFormat])}|`;
    listOfPayCodeIds += `${payCodeId1}|${payCodeId2}|`;
    listOfDurations += `${duration1}|${duration2}|`;
  });

  listOfDurations = listOfDurations.slice(0, -1);
  listOfPayCodeIds = listOfPayCodeIds.slice(0, -1);
  listOfDates = listOfDates.slice(0, -1);
  return {
    listOfDates, listOfDurations, listOfPayCodeIds,
  };
};

const hasNotes = (notes: string) => {
  const notesExist = notes.length >= 1;
  return notesExist;
};

export function* saveTimeOffRequestSaga(action: SaveTimeOffRequestPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timeOffResource = yield select(getTimeOff);
    const updatedDetailOfTimeOfRequest = yield select(getItemDetailOfTimeOffRequests);
    const { listOfDates, listOfDurations, listOfPayCodeIds } = getListsForPayload(updatedDetailOfTimeOfRequest);
    const { resourceId } = timeOffResource;
    const {
      payload: {
        summaryEndDate, summaryStartDate, timeOffRequestId, notes,
      },
    } = action;
    const isEdit = timeOffRequestId !== zeroRequestId;
    const SaveTimeOffRequest = {
      resourceId,
      requestId: timeOffRequestId,
      IsEdit: isEdit,
      listOfDates: listOfDates.replace(/\n/g, ''),
      listOfDurations,
      listOfPayCodeIds,
      headerStartDate: `${getDateAgainstFormat(summaryStartDate, formatsMapper[yearMonthDayFormat])}`,
      headerEndDate: `${getDateAgainstFormat(summaryEndDate, formatsMapper[yearMonthDayFormat])}`,
      separator: '',
    };

    const response = yield call(genericPost, SAVE_TIME_OFF_REQUEST, SaveTimeOffRequest, undefined, true);
    const {
      isSuccessfull, validation, data,
    } = response;
    const { requestId } = data;
    const { statusMessage } = validation;
    if (requestId > ApiStatusCode.Success && isSuccessfull) {
      if (timeOffRequestId === zeroRequestId) {
        yield put(successSaveTimeOffRequest(true));
        if (hasNotes(notes)) {
          const notesPayload = {
            note: notes,
            timeOffRequestId: requestId,
            addNotesOnCreateTimeOffRequest: !isEdit,
          };
          yield put(addTimeOffNotes(notesPayload));
        }
      } else {
        const summaryDate = getDateAgainstFormat(summaryEndDate, formatsMapper[yearMonthDayFormat]);
        yield put(getTimeOffRequests({ date: summaryDate }));
      }
      yield put(openPopup({
        message: statusMessage,
        severity: Severity.SUCCESS,
      }));
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

export function* timeOffRequestActionSaga(action: TimeOffRequestActionPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timeOffResource = yield select(getTimeOff);
    const { resourceId } = timeOffResource;
    const { payload: { actionId, requestedIds, dateOfTimeOfRequests } } = action;
    const currentRole = yield select(getCurrentMode);
    const TimeOffRequestActionPayload = {
      resourceId,
      actionId,
      managerMode: currentRole === UserRole.Manager,
      requestedRequestIds: requestedIds,
      separator: '|',
    };
    const response = yield call(genericPost, TIME_OFF_REQUEST_ACTION, TimeOffRequestActionPayload, undefined, true);
    const {
      isSuccessfull, status, validation,
    } = response;
    const { statusCode, statusMessage } = validation;
    if (status === ApiStatusCode.Success && isSuccessfull) {
      if (statusCode !== TimeOfRequestActionFailure) {
        const { pending, approved, denied } = reviewStatus;
        yield put(openPopup({
          message: statusMessage,
          severity: Severity.SUCCESS,
        }));
        yield put(showLoader());
        yield put(setSummaryInformation([]));
        yield put(setListOfReviewStatus([pending, approved, denied]));
        yield put(getTimeOffRequests({ date: dateOfTimeOfRequests }));
      } else {
        yield put(openPopup({
          message: statusMessage,
          severity: Severity.ERROR,
        }));
        yield put(hideLoader());
      }
    } else {
      yield put(openPopup({
        message: statusMessage,
        severity: Severity.ERROR,
      }));
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
    // will integrate sentry
  }
}

export function* getTimeOffNotesSaga(action: GetTimeOffNotesPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const timeOff = yield select(getTimeOff);
    const { resourceId } = timeOff;
    const { payload } = action;
    const { requestId, fetcNotesAfterAddingNotes } = payload;
    const NotesQueryParams: Record<string, string> = {
      resourceId,
      requestId,
    };
    const response = yield call(genericGet, TIME_OFF_NOTES, undefined, true, NotesQueryParams);
    const { list, status } = response;
    const {
      data: { notesDetails, actions },
    } = list;
    if (status === ApiStatusCode.Success) {
      yield put(saveNotesDetailOfTimeOffRequest(notesDetails));
      yield put(saveActionsTimeOffNotes(actions));
      if (!fetcNotesAfterAddingNotes) {
        yield put(navigateToNotesScreen(true));
      }
    }
  } catch (error) {
    // will integrate sentry
  } finally {
    yield put(hideLoader());
  }
}

export function* addTimeOffNotesSaga(action: AddTimeOffNotesPayload): Generator<Effect, void, any> {
  try {
    yield put(showLoader());
    const {
      payload: {
        timeOffRequestId, note, addNotesOnCreateTimeOffRequest,
      },
    } = action;
    const requestId = timeOffRequestId.toString();
    const addNotesPayload = {
      requestId,
      note,
    };
    const response = yield call(genericPost, ADD_NOTES, addNotesPayload, undefined, true);
    const { isSuccessfull, validation } = response;
    const { statusMessage } = validation;
    if (isSuccessfull) {
      yield put(showLoader());
      if (addNotesOnCreateTimeOffRequest !== true) {
        yield put(saveNotesDetailOfTimeOffRequest([]));
        const notesPayload = {
          requestId,
          fetcNotesAfterAddingNotes: true,
        };
        yield put(setNoteSuccess(isSuccessfull));
        yield put(getTimeOffNotes(notesPayload));
        yield put(openPopup({
          message: statusMessage,
          severity: Severity.SUCCESS,
        }));
      }
    } else {
      yield put(hideLoader());
      yield put(saveNoteValidationMessage(statusMessage));
    }
  } catch (error) {
    yield put(hideLoader());
    // will integrate sentry
  }
}

export default function* timeOffRequestsRootSaga(): Generator<Effect, void, any> {
  yield takeLatest(getTimeOffRequests.type, getTimeOffRequestsSaga);
  yield takeLatest(saveTimeOffRequest.type, saveTimeOffRequestSaga);
  yield takeLatest(startTimeOffRequest.type, startTimeOffRequestSaga);
  yield takeLatest(getDetailOfTimeOffRequests.type, getDetailOfTimeOffRequestsSaga);
  yield takeLatest(timeOffRequestAction.type, timeOffRequestActionSaga);
  yield takeLatest(getTimeOffNotes.type, getTimeOffNotesSaga);
  yield takeLatest(addTimeOffNotes.type, addTimeOffNotesSaga);
}
