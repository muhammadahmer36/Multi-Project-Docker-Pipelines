import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import { useDispatch } from 'react-redux';
import { Nullable } from 'types/common';
import { primaryColor } from 'appConstants/colors';
import {
  getPolygon, validateGeolocation, setCoordinates, setPositionError,
} from './slice';
import { useGeolocated } from './hooks/useGeolocation';
import { Coordinates } from './types';

export default function Geolocation() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
    isLocationEnabledFromSetting,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    watchPosition: true,
    watchLocationPermissionChange: true,
  });
  const [showDialog, setShowDialog] = useState(true);
  const [hasReceivedGeolocation, setHasReceivedGeolocation] = useState(false);
  const latestCoordinatesRef = useRef<Nullable<Coordinates>>(null);

  const dispatchGeolocationValidation = useCallback(() => {
    if (coords) {
      const { latitude, longitude } = coords;
      dispatch(setCoordinates({ latitude, longitude }));
      dispatch(validateGeolocation({
        latitude,
        longitude,
        showLoader: false,
      }));
    }
  }, [coords, hasReceivedGeolocation]);

  useEffect(() => {
    dispatch(getPolygon());
  }, []);

  useEffect(() => {
    if (!isGeolocationAvailable || !isGeolocationEnabled || positionError || !isLocationEnabledFromSetting) {
      dispatch(setPositionError(true));
      setShowDialog(true);
    } else {
      setShowDialog(false);
      dispatch(setPositionError(false));
    }
  }, [isGeolocationAvailable, isGeolocationEnabled, positionError, isLocationEnabledFromSetting]);

  useEffect(() => {
    if (coords && !hasReceivedGeolocation) {
      setHasReceivedGeolocation(true);
    }
  }, [coords]);

  useEffect(() => {
    dispatchGeolocationValidation();
    latestCoordinatesRef.current = coords;
  }, [coords?.latitude, coords?.longitude]);

  useEffect(() => {
    const handleOnline = () => {
      if (latestCoordinatesRef.current) {
        const { latitude, longitude } = latestCoordinatesRef.current;
        dispatch(validateGeolocation({
          latitude,
          longitude,
          showLoader: false,
        }));
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <Dialog open={showDialog}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 0,
        }}
      >
        <DialogContentText sx={{ color: primaryColor, fontWeight: '700', fontSize: 16 }}>
          {t('Geolocation')}
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: primaryColor, fontWeight: '500', fontSize: 14 }}>
          {t('geolocationServiceDisabledContent')}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
