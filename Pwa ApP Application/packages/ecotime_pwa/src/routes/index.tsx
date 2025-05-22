import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthenticationMethods } from 'appConstants';
import { getAuthenticationTypeId } from 'common/selectors/common';
import privateRoutes from './privateRoutes';
import samlRoutes from './samlRoutes';
import activeDirectoryRoutes from './activeDirectoryRoutes';
import applicationBasedAuthenticationRoutes from './applicationBasedAuthenticationRoutes';

export default function ApplicationRoutes() {
  const authenticationId = useSelector(getAuthenticationTypeId);
  switch (authenticationId) {
    case AuthenticationMethods.Saml:
      return useRoutes([samlRoutes, privateRoutes]);
    case AuthenticationMethods.ApplicationBasedAuthentication:
      return useRoutes([applicationBasedAuthenticationRoutes, privateRoutes]);
    case AuthenticationMethods.ActiveDirectory:
      return useRoutes([activeDirectoryRoutes, privateRoutes]);
    default:
      return null;
  }
}
