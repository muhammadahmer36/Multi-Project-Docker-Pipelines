import {
  all, takeEvery,
} from 'redux-saga/effects';

import
activeDirectoryLoginRootSaga
  from 'pages/authentication/activeDirectory/Login/sagas';

import
activeDirectoryRegistrationRootSaga
  from 'pages/authentication/activeDirectory/Registration/sagas';

import
additionalInformationRootSaga
  from 'pages/AdditionalData/sagas';

import punchHistoryRootSaga from 'pages/PunchHistory/sagas';
import samlSaga from 'pages/authentication/saml/sagas';
import timeOff from 'pages/TimeOffCalendar/sagas';
//* **************************************************All EcoTime Types ******************/
import offlineSaga from 'core/offline/sagas';
import backgroundTimeSyncingSaga from 'core/runningClockSyncing/sagas';
import geolocationSaga from 'core/geolocation/sagas';

import timePunch from 'pages/dashboard/TimePunches/sagas';
import dashboard from 'pages/dashboard/sagas';
import balancesSaga from 'pages/Balances/sagas';
import permissonsSaga from 'common/sagas/permissons';
import commonSaga from 'common/sagas/common';
import categorySaga from 'pages/BalanceCategory/sagas';
import timesheetSaga from 'pages/Timesheet/sagas';
import timesheetWeeklySaga from 'pages/TimesheetWeekly/sagas';
import timesheetDailySaga from 'pages/TimesheetDaily/sagas';
import TimesheetCertifyUncertifySaga from 'pages/TimesheetCertifyUncertify/sagas';
import TimesheetNotesSaga from 'pages/TimesheetNotes/sagas';
import timesheetSearchManager from 'pages/TimesheetSearchManager/sagas';
import timesheetManager from 'pages/TimesheetManager/sagas';

import * as authTypes from '../constants/authTypes';
import * as activeDirectoryTypes from '../constants/authActiveDirectoryTypes';

//* **************************************************All EcoTime Sagas ******************/
import {
  loginSaga, validateUserNameSaga, registerSaga, confirmAbaUserSaga, forgotUserNameSaga,
  userForgotPasswordSaga, updatePasswordSaga, resendCodeForConfrimUserSaga, passwordExpireSaga,
} from './applicationBasedAuthentication/authSaga';

import {
  adLoginSaga, adRegistrationSaga,
} from './activeDirectory/activeDirectorySaga';

function* watchEcoTime() {
  yield all([
    backgroundTimeSyncingSaga(),

    //* *************************** Application Based Authentication******************//
    takeEvery(authTypes.LOGIN_APP, loginSaga),
    takeEvery(authTypes.VALIDATE_USER_NAME, validateUserNameSaga),
    takeEvery(authTypes.REGISTER_ABA_USER, registerSaga),
    takeEvery(authTypes.CONFIRM_ABA_USER, confirmAbaUserSaga),
    takeEvery(authTypes.USER_FORGOT_PASSWORD, userForgotPasswordSaga),
    takeEvery(authTypes.UPDATE_PASSWORD, updatePasswordSaga),
    takeEvery(authTypes.RESEND_CODE_FOR_CONFIRM_USER, resendCodeForConfrimUserSaga),
    takeEvery(authTypes.PASSWORD_EXPIRE, passwordExpireSaga),
    takeEvery(authTypes.FORGET_USER_NAME, forgotUserNameSaga),
    //* *************************** Active Directory Authentication******************//
    takeEvery(activeDirectoryTypes.AD_LOGIN_APP, adLoginSaga),
    takeEvery(activeDirectoryTypes.AD_REGISTRATION, adRegistrationSaga),
    //* ***************************Users*****************//
    // we need to refactor above watcher saga move it to its respective saga file
    offlineSaga(),
    samlSaga(),
    timePunch(),
    dashboard(),
    timeOff(),
    activeDirectoryLoginRootSaga(),
    activeDirectoryRegistrationRootSaga(),
    geolocationSaga(),
    additionalInformationRootSaga(),
    balancesSaga(),
    categorySaga(),
    punchHistoryRootSaga(),
    permissonsSaga(),
    timesheetSaga(),
    timesheetWeeklySaga(),
    timesheetDailySaga(),
    commonSaga(),
    TimesheetCertifyUncertifySaga(),
    TimesheetNotesSaga(),
    timesheetSearchManager(),
    timesheetManager(),
  ]);
}

export default watchEcoTime;
