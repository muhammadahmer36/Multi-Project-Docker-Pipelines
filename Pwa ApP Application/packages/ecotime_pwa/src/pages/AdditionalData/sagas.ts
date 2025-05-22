/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Effect,
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import { genericGet, genericPost } from 'utilities';
import {
  ApiStatusCode, GET_ADDITIONAL_INFORMATION,
  POST_ADDITIONAL_INFORMATION, ValidationStatusCodes,
} from 'appConstants';
import { openPopup } from 'components/Popup/slice';
import { ApiResponse } from 'types/api';
import { TimePunch } from 'pages/dashboard/TimePunches/types';
import { Severity } from 'components/SnackBar/types';
import {
  getAdditionalInformation,
  setAdditionalInformationIn,
  setAdditionalInformationOut,
  setAdditionalInformationTransfer,
  postAdditionalDataForm,
  disableApplicationHeader,
  setShowLoader,
  navigateToAdditionalDataForm,
  setPunchHeaderInformation,
} from './slice';
import {
  IAdditionInformationItems, IFormAdditionalDataPayload, IPunchDetail, Data,
} from './types';

export function* getAdditionalInformationSaga(): Generator<Effect, void, unknown> {
  try {
    const response = yield call(genericGet, GET_ADDITIONAL_INFORMATION, undefined, true);
    const { list, status } = response as any;
    const { isSuccessfull } = list;
    if (list && status === ApiStatusCode.Success && isSuccessfull) {
      const { data } = list as ApiResponse<IAdditionInformationItems>;
      const { 1: TimeIn, 2: TimeOut, 3: Transfer } = data;
      yield put(setAdditionalInformationIn(TimeIn));
      yield put(setAdditionalInformationOut(TimeOut));
      yield put(setAdditionalInformationTransfer(Transfer));
    }
  } catch (error) {
    // will integrate sentry
  }
}

export function* updateAdditionalInformationOfPunchType(data: Data, offlinePunch?: boolean, punch?: TimePunch)
  : Generator<Effect, void, any> {
  if (!data || !data.punchAdditionalInfo || !Array.isArray(data.punchAdditionalInfo.punchDetails)) {
    return;
  }

  const { TimeIn, TimeOut, Transfer } = TimePunch;
  const { punchAdditionalInfo } = data;
  const {
    punchTasksList, punchDetails, punchHeader,
  } = punchAdditionalInfo;
  const { optionHeader } = punchHeader;
  const punchDataSet = {
    punchDetails,
    punchTasksList,
  };

  if (punch === TimeIn) {
    yield put(setAdditionalInformationIn(punchDataSet));
  } else if (punch === TimeOut) {
    yield put(setAdditionalInformationOut(punchDataSet));
  } else if (punch === Transfer) {
    yield put(setAdditionalInformationTransfer(punchDataSet));
  }
  if (!offlinePunch) {
    yield put(navigateToAdditionalDataForm(true));
    yield put(setPunchHeaderInformation(optionHeader));
  }
}

const getFieldIds = (currentPunchDetail: IPunchDetail[]) => currentPunchDetail
  .map((item: IPunchDetail) => item.fldId)
  .join('|');

const getFieldValues = (data: object) => {
  const fieldValues = Object.values(data)
    .map((value) => {
      if (value === true) {
        return 1;
      } if (value === false) {
        return 0;
      }
      return value;
    })
    .join('|');

  return fieldValues;
};

export function* postAdditionalDataFormSaga(action: IFormAdditionalDataPayload): Generator<Effect, void, unknown> {
  const {
    currentPunchDetail, data, uniqueIndentifier,
  } = action.payload;
  const fieldIds = getFieldIds(currentPunchDetail);
  const fieldValues = getFieldValues(data);

  const PostAdditonalData = {
    clientGuidId: uniqueIndentifier,
    fieldIds,
    fieldValues,
    separator: '|',
  };

  try {
    yield put(setShowLoader(true));
    const response = yield call(
      genericPost,
      POST_ADDITIONAL_INFORMATION,
      PostAdditonalData,
      undefined,
      true,
    );
    const {
      statusCode,
      statusMessage,
    } = response as any;
    const { ApiSuccess } = ValidationStatusCodes;
    if (statusCode === ApiSuccess) {
      yield put(disableApplicationHeader(false));
      yield put(openPopup({
        message: statusMessage,
        severity: statusCode === ApiSuccess ? Severity.SUCCESS : Severity.ERROR,
      }));
    } else {
      yield put(openPopup({
        message: statusMessage,
        severity: Severity.ERROR,
      }));
    }
  } catch (error) {
    // integrate senety
  } finally {
    yield put(setShowLoader(false));
  }
}

export default function* additionalInformationRootSaga(): Generator<Effect, void, any> {
  yield takeLatest(getAdditionalInformation.type, getAdditionalInformationSaga);
  yield takeLatest(postAdditionalDataForm.type, postAdditionalDataFormSaga);
}
