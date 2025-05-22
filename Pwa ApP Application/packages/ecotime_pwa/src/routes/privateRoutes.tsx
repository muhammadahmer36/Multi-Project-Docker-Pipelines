import React from 'react';
import { Navigate } from 'react-router-dom';
import LazyLoadWrapper from 'utilities/lazyLoadWrapper';
import Layout from 'layout/layout';
import AuthGuard from 'utilities/guards/authGuard';
import {
  timeOffNotes,
  dashboard,
  additionalInformation,
  balances,
  balanceCategory,
  punchHistory,
  about,
  timeOff,
  timeOffList,
  timeOffRequestDetail,
  addTimeOffRequest,
  saveTimeOffRequest,
  editHours,
  timesheet,
  timesheetWeekly,
  timesheetDaily,
  timesheetCertifyUncertify,
  timesheetNotes,
  timeOffSearch,
  timesheetManager,
  timesheetSearchManager,
  balanceSearchManager,
} from 'appConstants';

const AdditionalInformation = React.lazy(() => import('pages/AdditionalData'));
const Dashboard = React.lazy(() => import('pages/dashboard/dashboard'));
const Balances = React.lazy(() => import('pages/Balances'));
const BalanceCategory = React.lazy(() => import('pages/BalanceCategory'));
const PunchHistory = React.lazy(() => import('pages/PunchHistory'));
const About = React.lazy(() => import('pages/About'));
const TimeOff = React.lazy(() => import('pages/TimeOffCalendar'));
const TimeOffNotes = React.lazy(() => import('pages/TimeOffNotes'));
const TimeOffRequestDetail = React.lazy(() => import('pages/TimeOffDetail'));
const TimeOffList = React.lazy(() => import('pages/TimeOffList'));
const AddTimeOffRequest = React.lazy(() => import('pages/AddTimeOffRequest'));
const SaveTimeOffRequest = React.lazy(() => import('pages/SaveTimeOffRequest'));
const EditHours = React.lazy(() => import('pages/TimeOffEditHours'));
const Timesheet = React.lazy(() => import('pages/Timesheet'));
const TimesheetSearchManager = React.lazy(() => import('pages/TimesheetSearchManager'));
const TimesheetManager = React.lazy(() => import('pages/TimesheetManager'));
const TimesheetWeekly = React.lazy(() => import('pages/TimesheetWeekly'));
const TimesheetDaily = React.lazy(() => import('pages/TimesheetDaily'));
const TimesheetCertifyUncertify = React.lazy(() => import('pages/TimesheetCertifyUncertify'));
const TimesheetNotes = React.lazy(() => import('pages/TimesheetNotes'));
const TimeOffSearchManager = React.lazy(() => import('pages/TimeOffSearchManager'));
const BalanceSearchManager = React.lazy(() => import('pages/BalanceSearchManager'));

const privateRoutes = {
  path: '/',
  element: (<AuthGuard><Layout /></AuthGuard>),
  children: [
    {
      path: '/',
      element: <Navigate to={dashboard} replace />,
    },
    {
      path: dashboard,
      element: <LazyLoadWrapper><Dashboard /></LazyLoadWrapper>,
    },
    {
      path: balances,
      element: <LazyLoadWrapper><Balances /></LazyLoadWrapper>,
    },
    {
      path: balanceCategory,
      element: <LazyLoadWrapper><BalanceCategory /></LazyLoadWrapper>,
    },
    {
      path: punchHistory,
      element: <LazyLoadWrapper><PunchHistory /></LazyLoadWrapper>,
    },
    {
      path: additionalInformation,
      element: <LazyLoadWrapper><AdditionalInformation /></LazyLoadWrapper>,
    },
    {
      path: about,
      element: <LazyLoadWrapper><About /></LazyLoadWrapper>,
    },
    {
      path: timeOff,
      element: <LazyLoadWrapper><TimeOff /></LazyLoadWrapper>,
    },
    {
      path: timeOffNotes,
      element: <LazyLoadWrapper><TimeOffNotes /></LazyLoadWrapper>,
    },
    {
      path: timesheetWeekly,
      element: <LazyLoadWrapper><TimesheetWeekly /></LazyLoadWrapper>,
    },
    {
      path: addTimeOffRequest,
      element: <LazyLoadWrapper><AddTimeOffRequest /></LazyLoadWrapper>,
    },
    {
      path: saveTimeOffRequest,
      element: <LazyLoadWrapper><SaveTimeOffRequest /></LazyLoadWrapper>,
    },
    {
      path: editHours,
      element: <LazyLoadWrapper><EditHours /></LazyLoadWrapper>,
    },
    {
      path: timeOffRequestDetail,
      element: <LazyLoadWrapper><TimeOffRequestDetail /></LazyLoadWrapper>,
    },
    {
      path: timeOffList,
      element: <LazyLoadWrapper><TimeOffList /></LazyLoadWrapper>,
    },
    {
      path: timesheet,
      element: <LazyLoadWrapper><Timesheet /></LazyLoadWrapper>,
    },
    {
      path: timesheetWeekly,
      element: <LazyLoadWrapper><TimesheetWeekly /></LazyLoadWrapper>,
    },
    {
      path: timesheetDaily,
      element: <LazyLoadWrapper><TimesheetDaily /></LazyLoadWrapper>,
    },
    {
      path: timesheetCertifyUncertify,
      element: <LazyLoadWrapper><TimesheetCertifyUncertify /></LazyLoadWrapper>,
    },
    {
      path: timesheetNotes,
      element: <LazyLoadWrapper><TimesheetNotes /></LazyLoadWrapper>,
    },
    {
      path: timeOffSearch,
      element: <LazyLoadWrapper><TimeOffSearchManager /></LazyLoadWrapper>,
    },
    {
      path: timesheetManager,
      element: <LazyLoadWrapper><TimesheetManager /></LazyLoadWrapper>,
    },
    {
      path: timesheetSearchManager,
      element: <LazyLoadWrapper><TimesheetSearchManager /></LazyLoadWrapper>,
    },
    {
      path: balanceSearchManager,
      element: <LazyLoadWrapper><BalanceSearchManager /></LazyLoadWrapper>,
    },
  ],
};

export default privateRoutes;
