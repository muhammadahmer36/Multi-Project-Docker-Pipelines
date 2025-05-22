import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMsal } from '@azure/msal-react';
import { AuthenticationMethods, activeDirectoryLogin, login } from 'appConstants';
import { resetLogout } from 'redux/actionCreators';
import { resetActiveDirectoryUserSession } from 'pages/authentication/activeDirectory/Login/slice';

export function useLogoutRedirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instance } = useMsal();

  async function redirectOnLogOut(authenticationId: number) {
    const { ApplicationBasedAuthentication, Saml, ActiveDirectory } = AuthenticationMethods;

    switch (authenticationId) {
      case ApplicationBasedAuthentication:
        navigate(login);
        dispatch(resetLogout());
        break;
      case ActiveDirectory:
        navigate(activeDirectoryLogin);
        dispatch(resetActiveDirectoryUserSession());
        break;
      case Saml:
        await instance.logoutRedirect();
        break;
      default:
        break;
    }
  }

  return redirectOnLogOut;
}
