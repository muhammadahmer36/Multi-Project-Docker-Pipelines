import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthenticationMethods, activeDirectoryLogin, login } from 'appConstants';

interface UnAuthenticationSwitchProps {
    authenticationId: number;
}

function UnAuthenticationSwitch(props: UnAuthenticationSwitchProps) {
  const { authenticationId } = props;
  switch (authenticationId) {
    case AuthenticationMethods.Saml:
      return null;
    case AuthenticationMethods.ApplicationBasedAuthentication:
      return <Navigate to={login} replace />;
    case AuthenticationMethods.ActiveDirectory:
      return <Navigate to={activeDirectoryLogin} replace />;
    default:
      return null;
  }
}

export default UnAuthenticationSwitch;
