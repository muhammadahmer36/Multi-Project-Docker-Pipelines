/* eslint-disable @typescript-eslint/no-explicit-any */
import { put, call, Effect } from 'redux-saga/effects';
import { genericPost, setSession, checkNullOrUndefined } from 'utilities';
import { ApiResponse } from 'types/apiRes';
import { sagaInterface, userForgotAndResendInterface } from 'types/sagaArg';
import * as appConstants from 'appConstants/index';
import { getAdditionalInformationSaga } from 'pages/AdditionalData/sagas';
import { setAppInformation, setDashboardItems, setTimeAndDateInformation } from 'pages/dashboard/slice';
import { ApplicationInfo, DashboardItem, DateTimeFormats } from 'pages/dashboard/types';
import * as authTypes from 'redux/constants/authTypes';

function* saveTimeAndDateConfiguration(applicationInfo: ApplicationInfo): Generator<Effect, void, any> {
  const {
    dateTimeFormatClockWidget,
    dateFormat,
    dateTimeFormat,
    timeFormat,
  } = applicationInfo;
  const timeAndDateConfiguration = {
    dateTimeFormatClockWidget,
    dateFormat,
    dateTimeFormat,
    timeFormat,
  };
  yield put(setTimeAndDateInformation(timeAndDateConfiguration as DateTimeFormats));
}

export function* loginSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ABA_LOGIN, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const {
        isSuccessfull, validation, data,
      } = apiResponse;
      if (isSuccessfull && apiResponse.validation?.statusCode === 0) {
        yield put({
          type: authTypes.LOGIN_APP_SUC,
          payload: {
            token: data?.token,
            refreshToken: data?.refreshToken,
            userName: data?.dashboard?.applicationInfo.userEmployeeName,
          },
        });
        setSession({
          token: data.token,
          refreshToken: data.refreshToken,
        });
        yield put(setDashboardItems(data?.dashboard?.dashboardItems as DashboardItem[]));
        const applicationInfo = data?.dashboard?.applicationInfo;
        if (!checkNullOrUndefined(applicationInfo)) {
          yield put(setAppInformation(applicationInfo as ApplicationInfo));
          yield call(saveTimeAndDateConfiguration, applicationInfo);
        }
        yield call(getAdditionalInformationSaga);
      } else {
        yield put({ type: authTypes.LOGIN_APP_FAIL, payload: validation });
        if (apiResponse.validation?.statusCode
          === appConstants.ValidationStatusCodes.RegistrationNotConfirm) {
          yield put({
            type: authTypes.CODE_CONFIRM_FROM_LOGIN,
            data,
          });
        }
      }
    } else {
      yield put({ type: authTypes.LOGIN_APP_FAIL, payload: {} });
    }
  } catch (e) {
    yield put({
      type: authTypes.LOGIN_APP_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* validateUserNameSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ABA_VALIDATE_USER_NAME, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const {
        isSuccessfull, validation, data,
      } = apiResponse;
      if (isSuccessfull && apiResponse.validation?.statusCode === 0) {
        yield put({ type: authTypes.VALIDATE_USER_NAME_SUC, payload: data?.authenticationType });
      } else {
        yield put({ type: authTypes.VALIDATE_USER_NAME_FAIL, payload: validation });
        if (apiResponse.validation?.statusCode
          === appConstants.ValidationStatusCodes.RegistrationNotConfirm) {
          yield put({
            type: authTypes.NEED_CODE_CONFIRM,
            data,
          });
        }
      }
    } else {
      yield put({ type: authTypes.VALIDATE_USER_NAME_FAIL, payload: {} });
    }
  } catch (e) {
    yield put({
      type: authTypes.VALIDATE_USER_NAME_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* registerSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ABA_REGISTER_USER, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const { isSuccessfull, validation, data } = apiResponse;
      if (isSuccessfull && apiResponse.validation?.statusCode === 0) {
        yield put({ type: authTypes.REGISTER_ABA_USER_SUC, payload: data?.authenticationType });
      } else {
        yield put({ type: authTypes.REGISTER_ABA_USER_FAIL, payload: validation });
      }
    } else {
      yield put({ type: authTypes.REGISTER_ABA_USER_FAIL, payload: {} });
    }
  } catch (e) {
    yield put({
      type: authTypes.REGISTER_ABA_USER_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* confirmAbaUserSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ABA_CONFIRM_CODE, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const { isSuccessfull, validation } = apiResponse;
      if (isSuccessfull && apiResponse.validation?.statusCode
        === appConstants.ValidationStatusCodes.SuccessfullRegisteration) {
        yield put({ type: authTypes.CONFIRM_ABA_USER_SUC, payload: validation });
      } else {
        yield put({ type: authTypes.CONFIRM_ABA_USER_FAIL, payload: validation });
      }
    } else {
      yield put({ type: authTypes.CONFIRM_ABA_USER_FAIL, payload: {} });
    }
  } catch (e) {
    yield put({
      type: authTypes.CONFIRM_ABA_USER_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* userForgotPasswordSaga(request: userForgotAndResendInterface): Generator {
  try {
    const response = yield genericPost(appConstants.USER_FORGOT_PASSWORD, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const { validation, data } = apiResponse;
      if (request.forResend) {
        yield put({
          type: authTypes.RESEND_CODE_SUC,
          payload: { statusCode: appConstants.ApiStatusCode.Success, statusMessage: 'Successfull' },
        });
      } else {
        if (request.forResend === false) {
          yield put({ type: authTypes.PWA_RESTRICT_ACC_DEACTIVAE, payload: validation });
        }
        if (request.forResend !== false) {
          yield put({ type: authTypes.USER_FORGOT_PASSWORD_SUC, payload: validation });
        }
        if (apiResponse.validation?.statusCode
          === appConstants.ValidationStatusCodes.ForgotPasswordSucc) {
          yield put({ type: authTypes.SET_USER_FOR_UPDATE_PAS, payload: data?.authenticationType });
        }
      }
    } else if (request.forResend) {
      yield put({
        type: authTypes.RESEND_CODE_FAIL,
        payload: apiResponse?.validation,
      });
    } else {
      yield put({
        type: authTypes.USER_FORGOT_PASSWORD_FAIL,
        payload: apiResponse?.validation,
      });
    }
  } catch (e) {
    yield put({
      type: authTypes.USER_FORGOT_PASSWORD_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* updatePasswordSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.UPDATE_PASSWORD, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const { validation } = apiResponse;
      yield put({ type: authTypes.UPDATE_PASSWORD_SUC, payload: validation });
    }
  } catch (e) {
    yield put({
      type: authTypes.UPDATE_PASSWORD_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* resendCodeForConfrimUserSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ABA_RESEND_CONFIRM_CODE, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    const { validation } = apiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      yield put({
        type: authTypes.RESEND_CODE_SUC,
        payload: { statusCode: appConstants.ApiStatusCode.Success, statusMessage: 'Successfull' },
      });
    } else {
      yield put({
        type: authTypes.RESEND_CODE_FAIL,
        payload: validation,
      });
    }
  } catch (e) {
    yield put({
      type: authTypes.RESEND_CODE_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* passwordExpireSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.PASSWORD_EXPIRE, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success && apiResponse.isSuccessfull) {
      const { data } = apiResponse;
      yield put({
        type: authTypes.PASSWORD_EXPIRE_SUC,
        payload: {
          token: data?.token,
          refreshToken: data?.refreshToken,
          userName: data?.dashboard?.applicationInfo.userEmployeeName,
        },
      });
      setSession({
        token: data.token,
        refreshToken: data.refreshToken,
      });
      yield put(setDashboardItems(data?.dashboard?.dashboardItems as DashboardItem[]));
      const applicationInfo = data?.dashboard?.applicationInfo;
      if (!checkNullOrUndefined(applicationInfo)) {
        yield put(setAppInformation(applicationInfo as ApplicationInfo));
        yield call(saveTimeAndDateConfiguration, applicationInfo);
      }
      yield call(getAdditionalInformationSaga);
    } else {
      yield put({ type: authTypes.PASSWORD_EXPIRE_FAIL, payload: apiResponse?.validation });
    }
  } catch (e) {
    yield put({
      type: authTypes.PASSWORD_EXPIRE_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* forgotUserNameSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.FORGOT_USERNAME, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    const { validation } = apiResponse;
    yield put({ type: authTypes.FORGET_USER_NAME_RESPONSE, payload: validation });
  } catch (e) {
    yield put({
      type: authTypes.FORGET_USER_NAME_RESPONSE,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}
