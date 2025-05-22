import React from 'react';
import { Navigate } from 'react-router-dom';
import { CompInterface } from 'types/componentInterface';
import { dashboard } from 'appConstants';
import { getAccessToken } from '..';

export default function UnAuthGuard({ children }: CompInterface) {
  const isLoggedIn = Boolean(getAccessToken());

  if (isLoggedIn === false) {
    return children;
  }
  return <Navigate to={dashboard} replace />;
}
