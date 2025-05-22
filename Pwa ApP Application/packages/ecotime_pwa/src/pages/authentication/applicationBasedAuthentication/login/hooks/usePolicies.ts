import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { extractString } from 'utilities';
import {
  ValidationStatusCodes, abaConfirmCode, dashboard, resetPasword,
} from 'appConstants';
import {
  saveloginDataForConfirmCode,
  resetLoginServerErrorTexts,
} from 'redux/actionCreators';
import * as authTypes from 'redux/constants/authTypes';
import { authResponse } from 'pages/authentication/applicationBasedAuthentication/selector';
import { IFormInput } from '../types';

const initialAccountsState = {
  expired: false,
  deactivate: false,
};

const usePolicies = ({ userName, password, rememberMe }: IFormInput) => {
  const [linkText, setLinkText] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoader, setShowLoader] = useState(false);
  const [accounts, setAccounts] = useState(initialAccountsState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginSelector = useSelector(authResponse);

  const resetFields = () => {
    setServerErrorMessage('');
    setLinkText('');
    setShowLoader(true);
  };

  const checkRemember = (isRememberember: boolean, rememberUserName: string) => {
    if (isRememberember) {
      localStorage.setItem('userName', rememberUserName);
      localStorage.setItem('isRemember', 'true');
    } else {
      localStorage.removeItem('userName');
      localStorage.removeItem('isRemember');
    }
  };

  const handleDeactivateOrExpiredAccount = (apiString: string, accountInfo: string) => {
    const
      { restWords, lastWord } = extractString(apiString);
    setServerErrorMessage(restWords);
    setLinkText(lastWord);
    if (accountInfo === 'deactivated') {
      setAccounts((prevState) => ({
        ...prevState,
        expired: false,
        deactivate: true,
      }));
    } else {
      setAccounts((prevState) => ({
        ...prevState,
        expired: true,
        deactivate: false,
      }));
    }
  };

  useEffect(() => {
    if (loginSelector?.token) {
      checkRemember(rememberMe, userName);
      setShowLoader(false);
      navigate(dashboard);
    } else if (loginSelector?.loginValidation) {
      setShowLoader(false);
      if (loginSelector?.loginValidation?.statusCode
        === ValidationStatusCodes.RegistrationNotConfirm) {
        const apiPayload = {
          deviceId: '1',
          deviceName: navigator.userAgent.replace(/\s+/g, ''),
          loginName: userName,
          password,
          rememberMe,
        };
        dispatch(saveloginDataForConfirmCode(apiPayload));
        navigate(abaConfirmCode);
      } else if (loginSelector?.loginValidation?.statusCode
        === ValidationStatusCodes.AccountDeactivate) {
        handleDeactivateOrExpiredAccount(loginSelector?.loginValidation?.statusMessage, 'deactivated');
        dispatch({ type: authTypes.ACCOUNT_DEACTIVATED });
      } else if (loginSelector?.loginValidation?.statusCode
        === ValidationStatusCodes.PasswordExpire) {
        handleDeactivateOrExpiredAccount(loginSelector?.loginValidation?.statusMessage, 'expired');
        dispatch({ type: authTypes.ACCOUNT_EXPIRED });
      } else {
        setServerErrorMessage(loginSelector?.loginValidation?.statusMessage);
        setLinkText('');
        dispatch({ type: authTypes.RESET_ACCOUNT_DEACTIVATED });
      }
      dispatch(resetLoginServerErrorTexts());
    } else if (loginSelector?.pwaAccessAccountDeactivate) {
      setShowLoader(false);
      if (loginSelector?.pwaAccessAccountDeactivate.statusCode
        === ValidationStatusCodes.ForgotPasswordSucc) {
        navigate(resetPasword, { state: { isAccountActivation: true } });
      } else {
        setServerErrorMessage(loginSelector?.pwaAccessAccountDeactivate?.statusMessage);
      }
      dispatch({ type: authTypes.RESET_PWA_RESTRICT_ACC_DEACTIVAE });
    }
  }, [loginSelector.token, loginSelector?.loginValidation,
    loginSelector.pwaAccessAccountDeactivate, navigate]);

  return {
    linkText, serverErrorMessage, isLoader, accounts, resetFields,
  };
};

export default usePolicies;
