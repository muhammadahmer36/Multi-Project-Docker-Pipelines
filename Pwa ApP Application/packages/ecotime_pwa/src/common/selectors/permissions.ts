import { RootState } from 'redux/reducer';

export const getPermissions = (state: RootState) => state.permissions.permissions;
