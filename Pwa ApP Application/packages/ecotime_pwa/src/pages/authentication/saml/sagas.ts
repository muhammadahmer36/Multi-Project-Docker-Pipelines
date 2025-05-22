/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect, call, put, takeLatest,
} from 'redux-saga/effects';
import { sagaInterface } from 'types/sagaArg';
import { IadLoginApiResponse } from 'types/activeDirectoryApiResponse';
import {
  checkNullOrUndefined,
  genericPost,
  getItemFromSessionStorage,
  setSession,
} from 'utilities';
import {
  ApiStatusCode,
  SAML_REGISTRATION,
  INTERNET_DOWN_RESPONSE,
  SAML_LOGIN,
  SamlAndActiveDirectoryValidations,
} from 'appConstants';
import {
  setAppInformation,
  setDashboardItems,
  setTimeAndDateInformation,
} from 'pages/dashboard/slice';
import { hideLoader, showLoader } from 'core/components/Loader/slice';
import {
  ApplicationInfo,
  DashboardItem,
  DateTimeFormats,
} from 'pages/dashboard/types';
import { getAdditionalInformationSaga } from 'pages/AdditionalData/sagas';
import {
  samlUserRegistrationSuccess,
  samlUserRegistrationFailure,
  registerSamlUser,
  loginSamlUser,
  getLoginSuccess,
  getLoginFailure,
  saveEmployeeDetailForRegistration,
} from './slice';
import { IRegistrationPayload } from './types';

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

export function* samlUserRegistration(request: IRegistrationPayload): Generator {
  try {
    const { payload } = request;
    const {
      employeeEmail, employeeNumber, userName, phone,
    } = payload;
    const registrationPayload = {
      employeeNumber,
      loginName: userName,
      emailAddress: employeeEmail,
      mobileNumber: phone,
    };
    const response = yield genericPost(SAML_REGISTRATION, registrationPayload, {
      Authorization:
        sessionStorage.getItem('idToken') == null
          ? ''
          : `Bearer ${sessionStorage.getItem('idToken')}`,
    });
    const apiResponse: IadLoginApiResponse = response as IadLoginApiResponse;
    if (apiResponse.status === ApiStatusCode.Success) {
      const { validation } = apiResponse;
      yield put(samlUserRegistrationSuccess(validation));
    }
  } catch (e) {
    yield put(samlUserRegistrationFailure(INTERNET_DOWN_RESPONSE));
  }
}

export function* samlUserLogin(request: sagaInterface): Generator {
  try {
    yield put(showLoader());
    const response = yield genericPost(SAML_LOGIN, request.payload, {
      Authorization:
        getItemFromSessionStorage('idToken') == null
          ? ''
          : `Bearer ${getItemFromSessionStorage('idToken')}`,
    });
    const apiResponse: IadLoginApiResponse = response as IadLoginApiResponse;
    const { UnRegisteredUser, SuccessfullLogin } = SamlAndActiveDirectoryValidations;
    const { data, validation } = apiResponse;
    if (validation?.statusCode === SuccessfullLogin) {
      const {
        token, refreshToken, dashboard,
      } = data;
      setSession({
        token,
        refreshToken,
      });
      yield put(getLoginSuccess(data));
      yield put(
        setDashboardItems(dashboard?.dashboardItems as DashboardItem[]),
      );
      const { applicationInfo } = dashboard;
      if (!checkNullOrUndefined(applicationInfo)) {
        yield put(setAppInformation(applicationInfo as ApplicationInfo));
        yield call(
          saveTimeAndDateConfiguration,
          data.dashboard.applicationInfo,
        );
      }
      yield call(getAdditionalInformationSaga);
    } else if (validation?.statusCode
      === UnRegisteredUser) {
      const {
        employeeDetail,
      } = data;
      yield (put(saveEmployeeDetailForRegistration(employeeDetail)));
      const validationResponse: { statusCode: number | undefined, statusMessage: '' } = {
        statusCode: validation?.statusCode,
        statusMessage: '',
      };
      yield put(getLoginFailure(validationResponse));
    } else {
      yield put(getLoginFailure(validation));
    }
  } catch (e) {
    yield put(samlUserRegistrationFailure(INTERNET_DOWN_RESPONSE));
  } finally {
    yield put(hideLoader());
  }
}

export default function* samlSaga(): Generator {
  yield takeLatest(registerSamlUser, samlUserRegistration);
  yield takeLatest(loginSamlUser, samlUserLogin);
}
