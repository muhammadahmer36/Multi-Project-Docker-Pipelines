/* eslint-disable max-len */
import React from 'react';
import Layout from 'layout/layout';
import UnAuthGuard from 'utilities/guards/unAuthGuard';
import LazyLoadWrapper from 'utilities/lazyLoadWrapper';
import {
  activeDirectoryRegistrationSuccess,
  activeDirectoryRegistration,
  activeDirectoryLogin,
} from 'appConstants';

const ActiveDirectoryLogin = React.lazy(
  () => import('pages/authentication/activeDirectory/Login'),
);
const ActiveDirectoryRegistration = React.lazy(
  () => import('pages/authentication/activeDirectory/Registration'),
);
const ActiveDirectoryRegistrationSuccess = React.lazy(
  () => import('pages/authentication/activeDirectory/RegistrationSuccess'),
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
      path: activeDirectoryLogin,
      element: (
        <LazyLoadWrapper>
          <ActiveDirectoryLogin />
        </LazyLoadWrapper>
      ),
    },
    {
      path: activeDirectoryRegistration,
      element: (
        <LazyLoadWrapper>
          <ActiveDirectoryRegistration />
        </LazyLoadWrapper>
      ),
    },
    {
      path: activeDirectoryRegistrationSuccess,
      element: (
        <LazyLoadWrapper>
          <ActiveDirectoryRegistrationSuccess />
        </LazyLoadWrapper>
      ),
    },
  ],
};

export default publicRoutes;
