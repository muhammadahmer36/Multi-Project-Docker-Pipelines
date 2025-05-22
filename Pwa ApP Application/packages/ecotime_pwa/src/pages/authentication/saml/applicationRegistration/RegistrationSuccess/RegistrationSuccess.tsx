import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getRegistrationResponseFromMsal } from 'pages/authentication/saml/selector';
import RegistrationSuccess from 'pages/authentication/common/RegistrationSuccess';
import { dashboard } from 'appConstants';
import { loginSamlUser } from 'pages/authentication/saml/slice';

function ActiveDirectoryRegistrationSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const {
    validation, isLoading, token, employeeDetail,
  } = useSelector(
    getRegistrationResponseFromMsal,
  );

  // eslint-disable-next-line object-shorthand
  const onConfirm = () => {
    const { employeeNumber, loginName: userName } = employeeDetail;
    const apiData = {
      loginName: userName,
      deviceId: '5',
      employeenumber: employeeNumber,
      deviceName: navigator.userAgent.replace(/\s+/g, ''),
    };
    dispatch(loginSamlUser(apiData));
    setServerErrorMessage('');
  };

  useEffect(() => {
    if (token) {
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
