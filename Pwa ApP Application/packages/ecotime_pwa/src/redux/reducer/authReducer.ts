import * as authTypes from '../constants/authTypes';
import { ReducerInterface } from '../../types/reducer';

const initialState = {
  loginToConfrmCode: null,
  loginData: null,
  token: null,
  refreshToken: null,
  userName: '',
  userDataForPasswordExpired: null,
  userDataForUpdatePassword: null,
  successfullUser: null,
  shouldUserNavigated: null,
  registeredUserResponse: null,
  validation: null,
  isAccountExpire: null,
  passwordExpireSuc: null,
  passwordExpireValidation: null,
  pwaAccessAccountDeactivate: null,
  loginValidation: null,
  forgetCredentials: null,
  resendCodeValidation: null,
  registrationStepTwoValues: null,
  fieldsDisableRegistration2: false,
  isAccountDeactivated: null,
};

export default function authReducer(state = { ...initialState }, action: ReducerInterface) {
  switch (action.type) {
    case authTypes.LOGIN_APP:
      return {
        ...state,
        isAccountExpire: null,
        isAccountDeactivated: null,
      };
    case authTypes.LOGIN_APP_SUC:
      return {
        ...state,
        token: action?.payload.token,
        refreshToken: action?.payload.refreshToken,
        userName: action?.payload.userName,
        loginValidation: null,
      };
    case authTypes.LOGIN_APP_FAIL:
      return {
        ...state,
        loginValidation: action?.payload,
      };
    case authTypes.SAVE_LOGIN_DATA:
      return {
        ...state,
        loginData: action?.payload,
        loginToConfrmCode: true,
      };
    case authTypes.SAVE_REGISTRATION2_VALUES:
      return {
        ...state,
        registrationStepTwoValues: action?.payload,
        fieldsDisableRegistration2: true,
      };
    case authTypes.REMOVE_REGISTRATION2_VALUES:
      return {
        ...state,
        registrationStepTwoValues: null,
        fieldsDisableRegistration2: false,
      };
    case authTypes.RESEND_CODE_SUC:
      return {
        ...state,
        resendCodeValidation: action?.payload,
      };
    case authTypes.FORGET_CREDENTIALS:
      return {
        ...state,
        forgetCredentials: action?.payload,
      };
    case authTypes.FORGET_USER_NAME_RESPONSE:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.RESEND_CODE_FAIL:
      return {
        ...state,
        resendCodeValidation: action?.payload,
      };
    case authTypes.VALIDATE_USER_NAME_SUC:
      return {
        ...state,
        shouldUserNavigated: true,
        successfullUser: action?.payload,
        validation: null,
      };
    case authTypes.VALIDATE_USER_NAME_FAIL:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.PWA_RESTRICT_ACC_DEACTIVAE:
      return {
        ...state,
        pwaAccessAccountDeactivate: action?.payload,
      };
    case authTypes.DATA_FOR_PASSWORD_EXP:
      return {
        ...state,
        userDataForPasswordExpired: action?.payload,
      };
    case authTypes.REGISTER_ABA_USER_SUC:
      return {
        ...state,
        registeredUserResponse: action?.payload,
      };
    case authTypes.REGISTER_ABA_USER_FAIL:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.USER_FORGOT_PASSWORD_SUC:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.PASSWORD_EXPIRE_SUC:
      return {
        ...state,
        token: action?.payload.token,
        refreshToken: action?.payload.refreshToken,
        userName: action?.payload.userName,
      };
    case authTypes.ACCOUNT_DEACTIVATED:
      return {
        ...state,
        isAccountDeactivated: true,
      };
    case authTypes.ACCOUNT_EXPIRED:
      return {
        ...state,
        isAccountExpire: true,
      };
    case authTypes.RESET_ACCOUNT_DEACTIVATED:
      return {
        ...state,
        isAccountDeactivated: null,
      };
    case authTypes.PASSWORD_EXPIRE_FAIL:
      return {
        ...state,
        passwordExpireValidation: action?.payload,
      };
    case authTypes.USER_FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.UPDATE_PASSWORD_SUC:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.CONFIRM_ABA_USER_SUC:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.CONFIRM_ABA_USER_FAIL:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.SAVE_EMP_NUMB:
      return {
        ...state,
        employeeNumber: action?.payload,
      };
    case authTypes.SET_USER_FOR_UPDATE_PAS:
      return {
        ...state,
        userDataForUpdatePassword: action?.payload,
      };
    case authTypes.SET_CONFIRM_MESSAGE:
      return {
        ...state,
        loginToConfrmCode: null,
      };
    case authTypes.NEED_CODE_CONFIRM:
      return {
        ...state,
        successfullUser: action?.data.authenticationType,
        loginToConfrmCode: false,
      };
    case authTypes.CODE_CONFIRM_FROM_LOGIN:
      return {
        ...state,
        successfullUser: action?.data.employeeDetail,
      };
    case authTypes.SET_USER_NAME:
      return {
        ...state,
        userName: action?.payload,
      };
    case authTypes.CONFIRM_ABA_USER:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        validation: action?.payload,
      };
    case authTypes.RESET_LOGIN_SERVER_TEXT_MESSAGE:
      return {
        ...state,
        loginValidation: null,
      };
    case authTypes.REMOVE_USER:
      return {
        ...state,
        successfullUser: null,
      };
    case authTypes.RESET_USER_NAVIGATION:
      return {
        ...state,
        shouldUserNavigated: false,
      };
    case authTypes.RESET_RESEND_CODE:
      return {
        ...state,
        resendCodeValidation: null,
      };
    case authTypes.RESET_LOGIN_APP:
      return {
        ...state,
        token: null,
        refreshToken: null,
        userName: '',
      };
    case authTypes.RESET_SERVER_TEXT_MESSAGE:
      return {
        ...state,
        validation: null,
      };
    case authTypes.RESET_DATA_FOR_UDAPTE_PASSWORD:
      return {
        ...state,
        userDataForUpdatePassword: null,
      };
    case authTypes.RESET_PASSWORD_EXPIRE:
      return {
        ...state,
        passwordExpireValidation: null,
      };
    case authTypes.RESET_CODE_FLOW:
      return {
        ...state,
        successfullUser: null,
        loginToConfrmCode: null,
      };
    case authTypes.RESET_ACCOUNT_EXPIRE_FLOW:
      return {
        ...state,
        isAccountExpire: null,
        passwordExpireValidation: null,
      };
    case authTypes.RESET_PWA_RESTRICT_ACC_DEACTIVAE:
      return {
        ...state,
        pwaAccessAccountDeactivate: null,
      };
    default:
      return { ...state };
  }
}
