import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import {
  Coordinates,
  InitialState,
  NotifyGeofenceRestriction,
  ResourceInPolygon,
  ValidateGeolocation,
} from './types';

const initialState: InitialState = {
  locationIsValid: false,
  geolocationRestricted: false,
  loading: false,
  polygon: [],
  coordinates: null,
  resourceInPolygon: [],
  positionError: true,
};

const geolocation = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    setLocationIsValid: (state, action:PayloadAction<boolean>) => {
      state.locationIsValid = action.payload;
    },
    setGeolocationRestriction: (state, action:PayloadAction<boolean>) => {
      state.geolocationRestricted = action.payload;
    },
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
    setPolygon: (state, action:PayloadAction<Coordinates[]>) => {
      state.polygon = action.payload;
    },
    setCoordinates: (state, action: PayloadAction<Coordinates>) => {
      state.coordinates = action.payload;
    },
    setResourceInPolygon: (state, action: PayloadAction<ResourceInPolygon[]>) => {
      state.resourceInPolygon = action.payload;
    },
    setPositionError: (state, action: PayloadAction<boolean>) => {
      state.positionError = action.payload;
    },
    resetGeolocation: () => initialState,
  },
});

export const {
  setLocationIsValid,
  setGeolocationRestriction,
  showLoader,
  setCoordinates,
  hideLoader,
  resetGeolocation,
  setPolygon,
  setResourceInPolygon,
  setPositionError,
} = geolocation.actions;

export const validateGeolocation = createAction<ValidateGeolocation>('geofencing/validateGeolocation');
export const notifyGeofenceRestrictiveActivity = createAction<NotifyGeofenceRestriction>('geofencing/restrictiveActivity ');

export const getPolygon = createAction('geofencing/getPolygon');

export default geolocation.reducer;
