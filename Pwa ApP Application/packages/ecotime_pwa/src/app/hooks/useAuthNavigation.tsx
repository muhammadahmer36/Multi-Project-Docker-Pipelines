import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthenticationType, setAuthenticationType } from 'common/slice/common';
import { clearOffflineQueue } from 'core/offline/slice';
import { getAuthenticationTypeId } from 'common/selectors/common';
import { getAccessToken, getLoginConfiguration } from 'utilities';

const useAuthNavigation = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const authenticationId = useSelector(getAuthenticationTypeId);
  const isLoggedIn = Boolean(getAccessToken());

  useEffect(() => {
    if (isLoggedIn === false) {
      const authenticationMessage = t('pleaseSetTheCorrectAuthenticationMode');
      dispatch(setAuthenticationType(null));
      dispatch(getAuthenticationType(authenticationMessage));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authenticationId !== null && isLoggedIn === false) {
      const getConfigRoute = getLoginConfiguration(authenticationId);
      if (pathname !== getConfigRoute) {
        navigate(getLoginConfiguration(authenticationId));
      }
    }
    if (isLoggedIn === false) {
      dispatch(clearOffflineQueue());
    }
  }, [isLoggedIn, authenticationId]);
};

export default useAuthNavigation;
