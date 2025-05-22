import React from 'react';
import Layout from 'layout/layout';
import UnAuthGuard from 'utilities/guards/unAuthGuard';
import LazyLoadWrapper from 'utilities/lazyLoadWrapper';
import {
  login,
  registrationStep1,
  forgotCredentials,
  abaConfirmCode,
  resetPasword,
  passwordExpired,
  registrationStep2,
  registrationSuccess,
} from 'appConstants';

const Login = React.lazy(
  () => import('pages/authentication/applicationBasedAuthentication/login/login'),
);

const ConfirmationCode = React.lazy(
  () => import(
    'pages/authentication/applicationBasedAuthentication/confirmationCode/confirmCode'
  ),
);
const Register = React.lazy(
  () => import(
    'pages/authentication/applicationBasedAuthentication/registrationStep1/registrationStep1'
  ),
);
const ForgotCredentials = React.lazy(
  () => import(
    'pages/authentication/applicationBasedAuthentication/forgotCredentials/forgotCredentials'
  ),
);
const ResetPassword = React.lazy(
  () => import(
    'pages/authentication/applicationBasedAuthentication/resetPassword/resetPassword'
  ),
);
const RegistrationSuccess = React.lazy(
  () => import(
    'pages/authentication/applicationBasedAuthentication/registrationSuccess/registrationSuccess'
  ),
);
const PasswordExpired = React.lazy(
  () => import(
    'pages/authentication/applicationBasedAuthentication/passwordExpired/passwordExpired'
  ),
);
const AdaAddReg = React.lazy(
  () => import(
    'pages/authentication/applicationBasedAuthentication/registrationStep2/registrationStep2'
  ),
);

const publicRoutes = {
  path: '/',
  element: (
    <UnAuthGuard>
      <Layout />
    </UnAuthGuard>
  ),
  children: [
    {
      path: login,
      element: (
        <LazyLoadWrapper>
          <Login />
        </LazyLoadWrapper>
      ),
    },
    {
      path: registrationStep1,
      element: (
        <LazyLoadWrapper>
          <Register />
        </LazyLoadWrapper>
      ),
    },
    {
      path: forgotCredentials,
      element: (
        <LazyLoadWrapper>
          <ForgotCredentials />
        </LazyLoadWrapper>
      ),
    },
    {
      path: resetPasword,
      element: (
        <LazyLoadWrapper>
          <ResetPassword />
        </LazyLoadWrapper>
      ),
    },
    {
      path: abaConfirmCode,
      element: (
        <LazyLoadWrapper>
          <ConfirmationCode />
        </LazyLoadWrapper>
      ),
    },
    {
      path: passwordExpired,
      element: (
        <LazyLoadWrapper>
          <PasswordExpired />
        </LazyLoadWrapper>
      ),
    },
    {
      path: registrationStep2,
      element: (
        <LazyLoadWrapper>
          <AdaAddReg />
        </LazyLoadWrapper>
      ),
    },
    {
      path: registrationSuccess,
      element: (
        <LazyLoadWrapper>
          <RegistrationSuccess />
        </LazyLoadWrapper>
      ),
    },
  ],
};

export default publicRoutes;
