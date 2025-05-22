import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSession } from 'utilities';
import { rememberUserName } from 'utilities/cacheUtility';
import RegistrationSuccess from 'pages/authentication/common/RegistrationSuccess';
import { dashboard } from 'appConstants';
import {
  loginActiveDirectoryUser,
} from '../Login/slice';
import { activeDirectoryLoginResponse } from '../Login/selector';

function ActiveDirectoryRegistrationSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const {
    token, refreshToken, userName, validation, isLoading, loginData,
  } = useSelector(activeDirectoryLoginResponse);

  const onConfirm = () => {
    dispatch(loginActiveDirectoryUser(loginData));
    setServerErrorMessage('');
  };

  useEffect(() => {
    if (token) {
      const { rememberMe, loginName } = loginData;
      rememberUserName(rememberMe, loginName);
      setSession({
        token,
        refreshToken,
        userName,
      });
      navigate(dashboard);
    } else if (validation) {
      setServerErrorMessage(validation?.statusMessage);
    }
  }, [token, validation, navigate]);

  return (
    <RegistrationSuccess
      isLoading={isLoading}
      onConfirm={onConfirm}
      serverErrorMessage={serverErrorMessage}
    />
  );
}

export default ActiveDirectoryRegistrationSuccess;
