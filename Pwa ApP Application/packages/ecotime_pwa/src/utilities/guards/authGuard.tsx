import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'core/geolocation';
import { getAuthenticationTypeId } from 'common/selectors/common';
import { CompInterface } from 'types/componentInterface';
import { permissions } from 'common/slice/permissions';
import { Permission } from 'components';
import {
  PERMISSIONS,
} from 'appConstants';
import { getAccessToken } from '..';
import UnAuthenticationSwitch from './unAuthentication';

function AuthGuard({ children }: CompInterface) {
  const authenticationId = useSelector(getAuthenticationTypeId);
  const isLoggedIn = Boolean(getAccessToken());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(permissions());
  }, []);

  if (isLoggedIn) {
    return (
      <Permission
        allowedPermissions={[PERMISSIONS.GEOFENCING]}
        fallbackComponent={children}
      >
        {children}
        <Geolocation />
      </Permission>
    );
  }

  return <UnAuthenticationSwitch authenticationId={authenticationId} />;
}

export default AuthGuard;
