import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'reduxjs-toolkit-persist';
import activeDirectoryLoginSlice from 'pages/authentication/activeDirectory/Login/slice';
import activeDirectoryRegistrationSlice from 'pages/authentication/activeDirectory/Registration/slice';
import offline from 'core/offline/slice';
import geolocation from 'core/geolocation/slice';
import timePunch from 'pages/dashboard/TimePunches/slice';
import additionalInformation from 'pages/AdditionalData/slice';
import common from 'common/slice/common';
import dashboard from 'pages/dashboard/slice';
import loader from 'core/components/Loader/slice';
import runningClockSyncing from 'core/runningClockSyncing/slice';
import popup from 'components/Popup/slice';
import Balances from 'pages/Balances/slice';
import punchHistory from 'pages/PunchHistory/slice';
import Category from 'pages/BalanceCategory/slice';
import internetStatusBar from 'components/InternetStatusBar/slice';
import permissions from 'common/slice/permissions';
import samlSlice from 'pages/authentication/saml/slice';
import timesheet from 'pages/Timesheet/slice';
import timesheetWeekly from 'pages/TimesheetWeekly/slice';
import timesheetDaily from 'pages/TimesheetDaily/slice';
import timesheetCertifyUncertify from 'pages/TimesheetCertifyUncertify/slice';
import timesheetNotes from 'pages/TimesheetNotes/slice';
import timesheetSearchManager from 'pages/TimesheetSearchManager/slice';
import timeOff from 'pages/TimeOffCalendar/slice';
import timesheetManager from 'pages/TimesheetManager/slice';
import authReducer from './authReducer';
import {
  persistConfigAdditionalInformation,
  persistConfigUniqueIdentifier,
  persistConfigTimeComponent,
  persistConfigOfflineQueue,
  persistConfigRunningClockSyncing,
  persistConnectivityStatusBar,
  persistPermissions,
  persistGeolocation,
  persistConfigDashboard,
  persistTimeOff,
  persistTimesheet,
  persistTimesheetWeekly,
  persistTimesheetDaily,
  persistTimesheetCertifyUncertify,
  persistTimesheetNotes,
  persistTimesheetSearchManager,
  persistTimesheetManager,
  persistBalances,
} from './persistanceConfiguration';

export const reducer = combineReducers({
  applicationBasedAuthorizationResponse: authReducer,
  activeDirectoryLoginRes: activeDirectoryLoginSlice,
  activeDirectoryRegistrationResponse: activeDirectoryRegistrationSlice,
  offlineQueue: persistReducer(persistConfigOfflineQueue, offline.offlineQueue),
  processingQueue: offline.processingQueue,
  timePunch: persistReducer(persistConfigTimeComponent, timePunch),
  additionalInformation: persistReducer(persistConfigAdditionalInformation, additionalInformation),
  dashboard: persistReducer(persistConfigDashboard, dashboard),
  runningClockSyncing: persistReducer(persistConfigRunningClockSyncing, runningClockSyncing),
  common: persistReducer(persistConfigUniqueIdentifier, common),
  geolocation: persistReducer(persistGeolocation, geolocation),
  timeOff: persistReducer(persistTimeOff, timeOff),
  Balances: persistReducer(persistBalances, Balances),
  popup,
  punchHistory,
  Category,
  loader,
  samlSlice,
  internetStatusBar: persistReducer(persistConnectivityStatusBar, internetStatusBar),
  permissions: persistReducer(persistPermissions, permissions),
  timesheet: persistReducer(persistTimesheet, timesheet),
  timesheetWeekly: persistReducer(persistTimesheetWeekly, timesheetWeekly),
  timesheetDaily: persistReducer(persistTimesheetDaily, timesheetDaily),
  timesheetCertifyUncertify: persistReducer(persistTimesheetCertifyUncertify, timesheetCertifyUncertify),
  timesheetNotes: persistReducer(persistTimesheetNotes, timesheetNotes),
  timesheetSearchManager: persistReducer(persistTimesheetSearchManager, timesheetSearchManager),
  timesheetManager: persistReducer(persistTimesheetManager, timesheetManager),

});

export type RootState = ReturnType<typeof reducer>
