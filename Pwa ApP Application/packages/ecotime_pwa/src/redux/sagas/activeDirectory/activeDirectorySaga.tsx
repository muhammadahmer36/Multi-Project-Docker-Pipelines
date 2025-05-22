import { put } from 'redux-saga/effects';
import * as activeDirectoryTypes from '../../constants/authActiveDirectoryTypes';
import { genericPost } from '../../../utilities';
import { ApiResponse } from '../../../types/apiRes';
import { sagaInterface } from '../../../types/sagaArg';
import * as appConstants from '../../../appConstants';

export function* adLoginSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ADA_LOGIN, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    const {
      isSuccessfull, status, data, validation,
    } = apiResponse;
    if (status === appConstants.ApiStatusCode.Success) {
      if (isSuccessfull) {
        yield put({
          type: activeDirectoryTypes.AD_LOGIN_SUC,
          payload: {
            token: data?.token,
            refreshToken: data?.refreshToken,
            userName: data?.dashboard?.applicationInfo.userEmployeeName,
          },
        });
      } else {
        yield put({ type: activeDirectoryTypes.AD_LOGIN_FAIL, payload: validation });
      }
    }
  } catch (e) {
    yield put({
      type: activeDirectoryTypes.AD_LOGIN_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}

export function* adRegistrationSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ADA_REGISTRATION, request.payload);
    const apiResponse: ApiResponse = response as ApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const { isSuccessfull, validation, data } = apiResponse;
      if (isSuccessfull && apiResponse.validation?.statusCode === 0) {
        yield put({
          type: activeDirectoryTypes.AD_REGISTRATION_SUC,
          payload: data?.authenticationType,
        });
      } else {
        yield put({ type: activeDirectoryTypes.AD_REGISTRATION_FAIL, payload: validation });
      }
    } else {
      yield put({ type: activeDirectoryTypes.AD_REGISTRATION_FAIL, payload: {} });
    }
  } catch (e) {
    yield put({
      type: activeDirectoryTypes.AD_REGISTRATION_FAIL,
      payload: appConstants.INTERNET_DOWN_RESPONSE,
    });
  }
}
