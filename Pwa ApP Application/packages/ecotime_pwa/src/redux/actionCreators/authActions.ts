import * as authTypes from '../constants/authTypes';
import { ReusableActionInterface } from '../../types/actionArg';

export const loginUser = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.LOGIN_APP,
  payload: data,
});

export const saveloginDataForConfirmCode = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.SAVE_LOGIN_DATA,
  payload: data,
});

export const validateUserName = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.VALIDATE_USER_NAME,
  payload: data,
});

export const userForgotPass = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.USER_FORGOT_PASSWORD,
  payload: data,
});

export const registerABAUser = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.REGISTER_ABA_USER,
  payload: data,
});

export const confirmABAUser = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.CONFIRM_ABA_USER,
  payload: data,
});

export const updatePassword = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.UPDATE_PASSWORD,
  payload: data,
});

export const setUserNameForForgotPassword = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.SET_USER_NAME,
  payload: data,
});

export const setValuesOfRegistrationStep2 = <T>(data: T): ReusableActionInterface<T> => ({
  type: authTypes.SAVE_REGISTRATION2_VALUES,
  payload: data,
});

export const setConfirmHeaderMessage = () => ({
  type: authTypes.SET_CONFIRM_MESSAGE,
});

export const resetLogout = () => ({
  type: authTypes.RESET_LOGIN_APP,
});

export const resetServerErrorTexts = () => ({
  type: authTypes.RESET_SERVER_TEXT_MESSAGE,
});

export const resetLoginServerErrorTexts = () => ({
  type: authTypes.RESET_LOGIN_SERVER_TEXT_MESSAGE,
});

export const resetUserNavigationToStep2 = () => ({
  type: authTypes.RESET_USER_NAVIGATION,
});

export const removeUserInfo = () => ({
  type: authTypes.REMOVE_USER,
});

export const removeValuesRegistrationStep2 = () => ({
  type: authTypes.REMOVE_REGISTRATION2_VALUES,
});

export const resetFlow = () => ({
  type: authTypes.RESET_CODE_FLOW,
});
