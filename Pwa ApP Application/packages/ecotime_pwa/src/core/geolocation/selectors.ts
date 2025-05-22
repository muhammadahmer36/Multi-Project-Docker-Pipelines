import { RootState } from 'redux/reducer';

export const getLocationIsValid = (root: RootState) => root.geolocation.locationIsValid;

export const getGeolocationAvailable = (root: RootState) => !root.geolocation.geolocationRestricted;

export const getLoading = (root: RootState) => root.geolocation.loading;

export const getPolygon = (root: RootState) => root.geolocation.polygon;

export const getCoordinates = (root: RootState) => root.geolocation.coordinates;

export const getResourcesInPolygon = (root: RootState) => root.geolocation.resourceInPolygon;

export const getPositionError = (root: RootState) => root.geolocation.positionError;
