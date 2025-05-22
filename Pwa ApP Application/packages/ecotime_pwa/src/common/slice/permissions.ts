import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { PermissionInitialState } from 'common/types/types';

const initialState: PermissionInitialState = {
  permissions: [],
};

const common = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermission: (state, action: PayloadAction<string>) => {
      state.permissions.push(action.payload);
    },
    removePermission: (state, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter((permission) => permission !== action.payload);
    },
    resetPermission: () => initialState,
  },
});

export const {
  setPermission,
  removePermission,
  resetPermission,
} = common.actions;

export const permissions = createAction('permission');

export default common.reducer;
