import { Resource } from 'common/types/types';

/* eslint-disable no-unused-vars */
export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface ValidateGeolocation {
  latitude: number;
  longitude: number;
  showLoader?: boolean
}

interface GeofenceMode {
  id: number;
  title: string;
  description: string;
  applicationMessage: string;
}

export interface ResourceInPolygon {
  resourceId: number;
  geofenceMode: GeofenceMode;
  isLocationValid: boolean;
}

export interface ResourceInPolygonResponse {
  data: ResourceInPolygon[];
}

export interface PointInPolygonResponse {
  locationIsValid: string;
}

export interface GeolocatedConfig {
    positionOptions?: PositionOptions;
    userDecisionTimeout?: number;
    geolocationProvider?: Geolocation;
    suppressLocationOnMount?: boolean;
    watchPosition?: boolean;
    isOptimisticGeolocationEnabled?: boolean;
    watchLocationPermissionChange?: boolean;
    // eslint-disable-next-line no-unused-vars
    onError?: (positionError?: GeolocationPositionError) => void;
    // eslint-disable-next-line no-unused-vars
    onSuccess?: (position: GeolocationPosition) => void;
}

export interface GeolocatedResult {
    coords: GeolocationCoordinates | undefined;
    timestamp: EpochTimeStamp | undefined;
    isGeolocationAvailable: boolean;
    isGeolocationEnabled: boolean;
    positionError: GeolocationPositionError | undefined;
    getPosition: () => void;
    isLocationEnabledFromSetting: boolean;
}

export enum GeolocationError {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
}

export interface InitialState {
  locationIsValid: boolean;
  geolocationRestricted: boolean;
  loading: boolean;
  polygon: Coordinates[],
  coordinates: Coordinates | null,
  resourceInPolygon: ResourceInPolygon[]
  positionError: boolean,
}
export interface NotifyGeofenceRestriction {
  resourceId: Resource
}
export interface NotifyGeofenceRestrictionParams {
  EmployeeNumber: string;
  Latitude: number;
  Longitude: number;
  ResourceId: number
}
