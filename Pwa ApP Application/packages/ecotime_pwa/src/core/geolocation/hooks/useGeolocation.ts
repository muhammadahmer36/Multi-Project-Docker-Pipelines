import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { GeolocatedConfig, GeolocatedResult, GeolocationError } from '../types';

export function useGeolocated(config: GeolocatedConfig = {}): GeolocatedResult {
  const {
    positionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: Infinity,
    },
    isOptimisticGeolocationEnabled = true,
    userDecisionTimeout = undefined,
    suppressLocationOnMount = false,
    watchPosition = false,
    geolocationProvider = typeof navigator !== 'undefined'
      ? navigator.geolocation
      : undefined,
    watchLocationPermissionChange = false,
    onError,
    onSuccess,
  } = config;

  const userDecisionTimeoutId = useRef(0);
  const isCurrentlyMounted = useRef(true);
  const watchId = useRef<number>(0);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(
    isOptimisticGeolocationEnabled,
  );
  const [isLocationEnabledFromSetting, setIsLocationEnabledFromSetting] = useState(false);
  const [coords, setCoords] = useState<GeolocationCoordinates | undefined>();
  const [timestamp, setTimestamp] = useState<EpochTimeStamp | undefined>();
  const [positionError, setPositionError] = useState<
        GeolocationPositionError | undefined
    >();

  const retryCountRef = useRef(0);
  const maxRetries = 3; // Set your maximum retry count
  const retryInterval = 500;

  const cancelUserDecisionTimeout = useCallback(() => {
    if (userDecisionTimeoutId.current) {
      window.clearTimeout(userDecisionTimeoutId.current);
    }
  }, []);

  const handlePositionError = useCallback(
    (error?: GeolocationPositionError) => {
      cancelUserDecisionTimeout();
      if (retryCountRef.current < maxRetries
        && error?.code === GeolocationError.POSITION_UNAVAILABLE) {
        retryCountRef.current += 1;
        if (watchPosition && watchId.current) {
          geolocationProvider?.clearWatch(watchId.current);
        }
        setTimeout(() => {
          // eslint-disable-next-line no-use-before-define
          getPosition();
        }, retryInterval);
      } else {
        if (isCurrentlyMounted.current) {
          setCoords(() => undefined);
          setIsGeolocationEnabled(false);
          setPositionError(error);
        }
        onError?.(error);
      }

      onError?.(error);
    },
    [onError, cancelUserDecisionTimeout, retryCountRef.current],
  );

  const handlePositionSuccess = useCallback(
    (position: GeolocationPosition) => {
      cancelUserDecisionTimeout();
      retryCountRef.current = 0;
      if (isCurrentlyMounted.current) {
        setCoords(position.coords);
        setTimestamp(position.timestamp);
        setIsGeolocationEnabled(true);
        setPositionError(() => undefined);
      }
      onSuccess?.(position);
    },
    [onSuccess, cancelUserDecisionTimeout],
  );

  const getPosition = useCallback(() => {
    if (
      !geolocationProvider
            || !geolocationProvider.getCurrentPosition
            || !geolocationProvider.watchPosition
    ) {
      throw new Error('The provided geolocation provider is invalid');
    }

    if (userDecisionTimeout) {
      userDecisionTimeoutId.current = window.setTimeout(() => {
        handlePositionError();
      }, userDecisionTimeout);
    }

    if (watchPosition) {
      watchId.current = geolocationProvider.watchPosition(
        handlePositionSuccess,
        handlePositionError,
        positionOptions,
      );
    } else {
      geolocationProvider.getCurrentPosition(
        handlePositionSuccess,
        handlePositionError,
        positionOptions,
      );
    }
  }, [
    geolocationProvider,
    watchPosition,
    userDecisionTimeout,
    handlePositionError,
    handlePositionSuccess,
    positionOptions,
  ]);

  useEffect(() => {
    if (!suppressLocationOnMount) {
      getPosition();
    }

    return () => {
      cancelUserDecisionTimeout();
      if (watchPosition && watchId.current) {
        geolocationProvider?.clearWatch(watchId.current);
      }
    };
  }, [isLocationEnabledFromSetting]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (
      watchLocationPermissionChange
            && geolocationProvider
            && 'permissions' in navigator
    ) {
      const checkPermissionStatus = async () => {
        navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
          setIsLocationEnabledFromSetting(state === 'granted');
        });
      };
      checkPermissionStatus();
      intervalId = setInterval(checkPermissionStatus, 1000);
    }
    return () => clearInterval(intervalId);
  }, []);

  return {
    getPosition,
    coords,
    timestamp,
    isGeolocationEnabled,
    isGeolocationAvailable: Boolean(geolocationProvider),
    positionError,
    isLocationEnabledFromSetting,
  };
}
