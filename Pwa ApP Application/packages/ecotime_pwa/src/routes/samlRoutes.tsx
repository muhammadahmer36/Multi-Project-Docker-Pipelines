import React from 'react';
import Layout from 'layout/layout';
import UnAuthGuard from 'utilities/guards/unAuthGuard';
import LazyLoadWrapper from 'utilities/lazyLoadWrapper';
import {
  samlAuthentication,
  samlUserRegistration,
  samlUserRegistrationSuccess,
  authenticationFailure,
} from 'appConstants';

import Login from 'pages/authentication/saml/microsoftAuthentication/Login';

const SamlUserRegistration = React.lazy(
  () => import('pages/authentication/saml/applicationRegistration/Registration'),
);

const SamlUserRegistrationSuccess = React.lazy(
  () => import(
    'pages/authentication/saml/applicationRegistration/RegistrationSuccess'
  ),
);

const AuthenticationFailure = React.lazy(
  () => import(
    'pages/authentication/saml/applicationRegistration/AuthenticationFailure'
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
      path: samlAuthentication,
      element: (
        <LazyLoadWrapper>
          <Login />
        </LazyLoadWrapper>
      ),
    },
    {
      path: samlUserRegistration,
      element: (
        <LazyLoadWrapper>
          <SamlUserRegistration />
        </LazyLoadWrapper>
      ),
    },
    {
      path: samlUserRegistrationSuccess,
      element: (
        <LazyLoadWrapper>
          <SamlUserRegistrationSuccess />
        </LazyLoadWrapper>
      ),
    },
    {
      path: authenticationFailure,
      element: (
        <LazyLoadWrapper>
          <AuthenticationFailure />
        </LazyLoadWrapper>
      ),
    },
  ],
};

export default publicRoutes;
