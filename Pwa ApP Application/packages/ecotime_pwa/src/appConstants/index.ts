/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export enum ApiStatusCode {
  Success = 200,
}
/* eslint-enable no-shadow */
/* eslint-enable no-unused-vars */

export const INTERNET_DOWN_RESPONSE = {
  statusCode: 503,
  statusMessage: 'Server did not respond as expected. Please try again!',
};

/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

export enum ValidationStatusCodes {
  AccessDenied = 11,
  InvalidCredentials = 31,
  InternetDown = 503,
  EmployeeIdNotActive = 1,
  InvalidEmployeeNumber = 7,
  AccountAlreadyExist = 2,
  SuccessfullRegisteration = 32,
  RegistrationNotConfirm = 34,
  ForgotPasswordSucc = 36,
  ForgotUserNameSucc = 43,
  UpdatePassword = 39,
  UserNameExist = 3,
  AccountDeactivate = 6,
  PasswordExpire = 5,
  UnRegisteredUser = 4,
  PunchSuccess = 47,
  PasswordNotExpired = 41,
  ApiSuccess = 0,
  MissedConfiguredProfile = 58,
  GeofenceTurnOffByAdmin = 82,
  GeofenceUnAuthorize = 57,
}

export enum SamlAndActiveDirectoryValidations {
  UnRegisteredUser = 45,
  SuccessfullLogin = 0,
  SuccessfullRegister = 32,
  AlreadyRegisteredUser = 2,
  EmployeeAccountNotActive = 1,
  InValidCredentials = 31,
  AccessDeined = 11,
}

export enum AuthenticationMethods {
  Saml = 2,
  ActiveDirectory = 1,
  ApplicationBasedAuthentication = 0,
}

export const TimeOfRequestActionFailure = 0;
export const APP_CURRENT_VERSION = '3.99.1';
export const LOGIN_ABA = 'aba';

/* eslint-enable no-shadow */
/* eslint-enable no-unused-vars */

//* ****API End Points *****//
export const GET_AUTHENTICATION_TYPE = 'Authentication/GetAuthenticationType';
export const ABA_LOGIN = 'Authentication/Login';
export const ABA_VALIDATE_USER_NAME = 'Authentication/UserValidation';
export const ABA_REGISTER_USER = 'Authentication/Registration';
export const ABA_CONFIRM_CODE = 'Authentication/ConfirmAccount';
export const ABA_RESEND_CONFIRM_CODE = 'Authentication/ResendConfirmationCode';
export const USER_FORGOT_PASSWORD = 'Authentication/ForgetPassword';
export const UPDATE_PASSWORD = 'Authentication/UpdatePassword';
export const PASSWORD_EXPIRE = 'Authentication/SetNewPassword';
export const FORGOT_USERNAME = 'Authentication/ForgetUsername';
//* ****Active Directory End Points *****//
export const ADA_LOGIN = 'ADAuthentication/Login';
export const ADA_REGISTRATION = 'ADAuthentication/Registration';

export const SAML_LOGIN = 'SamlAuthentication/Login';
export const SAML_REGISTRATION = 'SamlAuthentication/Registration';

export const BALANCE_SUMMARY = 'Balances/Summary';
export const BALANCE_FOR_TIMESHEET_GROUPS = 'Balances/GetBalanceInfoManager';
export const BALANCE_CATEGORIES = 'Balances/Categories';

export const TIMESHEET = 'Timesheet/GetByPayPeriod';
export const TIMESHEET_WEEKLY = 'Timesheet/GetByWeeks';
export const TIMESHEET_ACTION = 'Timesheet/ExecuteTSAction';
export const TIMESHEET_DAILY = 'Timesheet/GetByDays';
export const TIMESHEET_CERTIFY_UNCERTIFY = 'Timesheet/GetCertifyUncertify';
export const TIMESHEET_FETCH_NOTES = 'Timesheet/GetNotes';
export const TIMESHEET_ADD_NOTES = 'Timesheet/AddNote';
export const GET_TIMESHEET_SEARCH_PARAM = 'Timesheet/TimesheetSearchParams';
export const GET_TIMESHEET_SEARCH_RESULT = 'Timesheet/TimesheetSearchResult';
export const GET_ADDITIONAL_INFORMATION = 'TimePunches/GetAdditionalInfo';
export const POST_ADDITIONAL_INFORMATION = 'TimePunches/UpdatePunch';
export const PUNCH_HISTORY = 'TimePunches/Get';
export const FETCH_TIME_OFF = 'TimeOff/Get';
export const ADD_NOTES = 'TimeOff/AddNote';
export const FETCH_TIME_OFF_DETAIL = 'TimeOff/GetTimeOffDetails';
export const NEW_REQUEST_SUMMARY = 'TimeOff/NewRequestSummary';
export const SAVE_TIME_OFF_REQUEST = 'TimeOff/Save';
export const TIME_OFF_REQUEST_ACTION = 'TimeOff/ExecuteAction';
export const TIME_OFF_NOTES = 'TimeOff/Notes';
export const getClockComponent = 'TimePunches/ClockWidgetConfig';
export const addPunches = 'TimePunches/AddPunch';
export const geolocationPointInPolygon = 'Geo/checkPointInPolygon';
export const isGeofencingApplicable = 'Geo/IsGeofencingApplicable';
export const polygon = 'Geo/polygon';
export const resoucrceInPolygon = 'Geo/ResourceInPolygon';
export const NOTIFY_GEOFENCE_RESTRICTION = 'Geo/NotifyGeofenceRestrictions';
export const EMPLOYEE_LIST = 'Common/EmployeeSearchResults';
export const TIMESHEET_GROUPS = 'Common/TimesheetGroups';

//* ****Client Side EndPoints *****//
export const emp = '/employee';
export const dashboard = '/dashboard';
export const additionalInformation = '/additionalInformation';
export const saga = '/saga';
export const login = '/login';
export const samlAuthentication = '/saml/SignUp';
export const samlUserRegistration = '/samlUserRegistration';
export const samlUserRegistrationSuccess = '/samlUserRegistrationSuccess';
export const registrationStep1 = '/registrationStep1';
export const registrationStep2 = '/registrationStep2';
export const abaConfirmCode = '/confirmCode';
export const forgotCredentials = '/forgotCredentials';
export const resetPasword = '/resetPassword';
export const passwordExpired = '/passwordExpired';
export const registrationSuccess = '/registrationSuccess';
export const activeDirectoryLogin = '/ada/login';
export const punchHistory = '/punchHistory';
export const activeDirectoryRegistration = '/ada/registration';
export const activeDirectoryRegistrationSuccess = '/ada/registrationSuccess';
export const balances = '/balances';
export const authenticationFailure = '/authenticationFailure';
export const balanceCategory = '/balanceCategory';
export const timeOff = '/timeOff';
export const timeOffRequestDetail = '/timeOffRequestDetail';
export const timeOffNotes = '/timeOffNotes';
export const timeOffList = '/timeOffList';
export const timesheet = '/timesheet';
export const timesheetWeekly = '/timesheetWeekly';
export const timesheetDaily = '/timesheetDaily';
export const timesheetCertifyUncertify = '/timesheetCertifyUncertify';
export const timesheetNotes = '/timesheetNotes';
export const about = '/about';
export const addTimeOffRequest = '/addTimeOffRequest';
export const saveTimeOffRequest = '/saveTimeOffRequest';
export const editHours = '/editHours';
export const timeOffSearch = '/timeOffSearch';
export const timesheetManager = '/timesheetManager';
export const timesheetSearchManager = '/timesheetSearchManager';
export const balanceSearchManager = '/balanceSearchManager';
export const previousPage = -1;
export const whiteSpaceRegex = /^\s*$/;
export const commaseperatedAndRemoveBrTagRegex = /,\s*(?:<br>)?/;

export const PERMISSIONS = {
  GEOFENCING: 'geofencing',
};

export const footerHeight = 66;
export const heightForSingleTimeOff = 508;
export const heightForTimeOffDetailGridContainer = 217;
export const heightForAddTimeOffDetailGridContainer = 283;
export const heightForTimeOffNotesContainer = 152;
export const heightForTimeOffNotesContainerForManager = 265;
export const heightForTimeOffNotesContainerManager = 253;
export const weeksToShowInDateCalendar = 6;
export const punchHistoryDayLimitZero = 0;
export const zeroDuration = 0;
export const zeroRequestId = 0;
export const buttonLogOut = 'buttonLogOut';
export const monthDayYearFormat = 'MM/DD/YYYY';
export const yearMonthDayFormat = 'YYYY-MM-DD';
export const dropDownMinimumSearchLength = 3;
export const balanceListItemHeight = 52;
export const firstRecord = 1;
export const calendarMinimumDate = '1900-01-01';
export const calendarMaximumDate = '2099-12-31';
