/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect, put, takeLatest, call,
} from 'redux-saga/effects';
import { genericPost, setSession, checkNullOrUndefined } from 'utilities';
import { sagaInterface } from 'types/sagaArg';
import * as appConstants from 'appConstants';
import { IadLoginApiResponse } from 'types/activeDirectoryApiResponse';
import {
  setAppInformation,
  setDashboardItems,
  setTimeAndDateInformation,
} from 'pages/dashboard/slice';
import { getAdditionalInformationSaga } from 'pages/AdditionalData/sagas';
import {
  ApplicationInfo,
  DashboardItem,
  DateTimeFormats,
} from 'pages/dashboard/types';
import {
  getLoginActiveDirectorySuccess,
  loginActiveDirectoryUser,
  getLoginActiveDirectoryFailure,
  saveLoginDataForRegistrationSuccess,
} from './slice';
import { saveEmployeeDetailForRegistration } from '../Registration/slice';

function* saveTimeAndDateConfiguration(
  applicationInfo: ApplicationInfo,
): Generator<Effect, void, any> {
  const {
    dateTimeFormatClockWidget, dateFormat, dateTimeFormat, timeFormat,
  } = applicationInfo;
  const timeAndDateConfiguration = {
    dateTimeFormatClockWidget,
    dateFormat,
    dateTimeFormat,
    timeFormat,
  };
  yield put(
    setTimeAndDateInformation(timeAndDateConfiguration as DateTimeFormats),
  );
}

export function* activeDirectoryLoginSaga(
  request: sagaInterface,
): Generator<Effect, any, unknown> {
  try {
    const response = yield call(
      genericPost,
      appConstants.ADA_LOGIN,
      request.payload,
    );
    const apiResponse: IadLoginApiResponse = response as IadLoginApiResponse;
    const {
      isSuccessfull, status, data, validation,
    } = apiResponse;
    if (status === appConstants.ApiStatusCode.Success) {
      if (
        isSuccessfull
        && validation?.statusCode
          === appConstants.SamlAndActiveDirectoryValidations.SuccessfullLogin
      ) {
        const { token, refreshToken } = data;
        setSession({
          token,
          refreshToken,
        });
        yield put(getLoginActiveDirectorySuccess(data));
        yield put(
          setDashboardItems(data?.dashboard?.dashboardItems as DashboardItem[]),
        );
        const applicationInfo = data?.dashboard.applicationInfo;
        if (!checkNullOrUndefined(applicationInfo)) {
          yield put(
            setAppInformation(
              data?.dashboard.applicationInfo as ApplicationInfo,
            ),
          );
          yield call(
            saveTimeAndDateConfiguration,
            data.dashboard.applicationInfo,
          );
        }
        yield call(getAdditionalInformationSaga);
      } else if (
        validation?.statusCode
        === appConstants.SamlAndActiveDirectoryValidations.UnRegisteredUser
      ) {
        yield put(getLoginActiveDirectoryFailure(validation));
        yield put(saveEmployeeDetailForRegistration(data.employeeDetail));
        yield put(saveLoginDataForRegistrationSuccess(request.payload));
      } else {
        yield put(getLoginActiveDirectoryFailure(validation));
      }
    }
  } catch (e) {
    yield put(
      getLoginActiveDirectoryFailure(appConstants.INTERNET_DOWN_RESPONSE),
    );
  }
}

export default function* activeDirectoryLoginRootSaga(): Generator<
  Effect,
  void,
  any
  > {
  yield takeLatest(loginActiveDirectoryUser, activeDirectoryLoginSaga);
}
