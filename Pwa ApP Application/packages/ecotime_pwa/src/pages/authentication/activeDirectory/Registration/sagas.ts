import { put, takeLatest } from 'redux-saga/effects';
import { sagaInterface } from 'types/sagaArg';
import { IadLoginApiResponse } from 'types/activeDirectoryApiResponse';
import { genericPost } from 'utilities';
import * as appConstants from 'appConstants';
import {
  getActiveDirectoryRegistrationSuccess, getActiveDirectoryRegistrationFailure,
  registerActiveDirectoryUser,
} from './slice';

export function* activeDirectoryRegistrationSaga(request: sagaInterface): Generator {
  try {
    const response = yield genericPost(appConstants.ADA_REGISTRATION, request.payload);
    const apiResponse: IadLoginApiResponse = response as IadLoginApiResponse;
    if (apiResponse.status === appConstants.ApiStatusCode.Success) {
      const { validation } = apiResponse;
      yield put(getActiveDirectoryRegistrationSuccess(validation));
    }
  } catch (e) {
    yield put(getActiveDirectoryRegistrationFailure(
      appConstants.INTERNET_DOWN_RESPONSE,
    ));
  }
}

export default function* activeDirectoryRegistrationRootSaga(): Generator {
  yield takeLatest(registerActiveDirectoryUser, activeDirectoryRegistrationSaga);
}
