import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from 'pages/authentication/saml/microsoftAuthentication/samlconfig';
import { getRegistrationResponseFromMsal } from 'pages/authentication/saml/selector';
import {
  loginSamlUser,
  resetValidation,
} from 'pages/authentication/saml/slice';
import {
  authenticationFailure,
  dashboard,
  samlUserRegistration,
  SamlAndActiveDirectoryValidations,
} from 'appConstants';

function Login() {
  const { instance } = useMsal();
  const isUserSamlAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeAccount = instance.getActiveAccount();
  const {
    UnRegisteredUser,
    AccessDeined,
    EmployeeAccountNotActive,
    InValidCredentials,
  } = SamlAndActiveDirectoryValidations;
  const { employeenumber, name } = activeAccount?.idTokenClaims ?? {};
  const { token, validation } = useSelector(getRegistrationResponseFromMsal);

  const handleRequest = async () => {
    try {
      await instance.initialize();
      instance.loginRedirect({
        ...loginRequest,
        prompt: 'create',
      });
    } catch (error) {
      // error
    }
  };

  useEffect(() => {
    if (isUserSamlAuthenticated === false) {
      handleRequest();
    } else {
      const apiData = {
        loginName: name,
        deviceId: '5',
        employeenumber,
        deviceName: navigator.userAgent.replace(/\s+/g, ''),
      };
      dispatch(loginSamlUser(apiData));
    }
  }, [isUserSamlAuthenticated]);

  useEffect(() => {
    if (token) {
      navigate(dashboard);
    } else if (
      validation.statusCode === AccessDeined
      || validation.statusCode === EmployeeAccountNotActive
      || validation.statusCode === InValidCredentials
    ) {
      navigate(authenticationFailure);
    } else if (validation.statusCode === UnRegisteredUser) {
      navigate(samlUserRegistration);
      dispatch(resetValidation());
    }
  }, [token, navigate, validation]);
  return (
    <div />
  );
}

export default Login;
