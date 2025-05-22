import { getPermissions } from 'common/selectors/permissions';
import { Permission } from 'common/types/types';
import React from 'react';
import { useSelector } from 'react-redux';

interface Props {
  allowedPermissions: string[];
  children: React.ReactNode
  fallbackComponent?: React.ReactNode;
}

export default function Permissions(props: Props) {
  const permissions = useSelector(getPermissions);
  const { allowedPermissions, children, fallbackComponent } = props;

  const hasPermission = permissions.some((permission: Permission) => allowedPermissions.includes(permission as string));

  if (hasPermission) {
    return children as React.ReactElement;
  }

  if (fallbackComponent) {
    return fallbackComponent as React.ReactElement;
  }

  return null;
}
