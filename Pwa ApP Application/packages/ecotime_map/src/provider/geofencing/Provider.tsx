import { Geofence, GeofenceVertex } from 'api/types';
import React, { ReactNode, createContext, useEffect, useState } from 'react';
import * as api  from 'api/client'
import { getPayloadFromJwt, getValueFromSessionStorage } from 'core/utils';
import { useNavigate } from 'react-router-dom';

 type Nullable<T> = T | null | undefined;

interface GeofencingContextType {
    geofences: Geofence[];
    polygons: Array<Array<google.maps.LatLngLiteral>>,
    setPolygons: (polygon: Array<Array<google.maps.LatLngLiteral>>) => void,
    getPolygon: (geofenceId: number) => void,
    center: google.maps.LatLngLiteral | null,
    setCenter: (polygon: google.maps.LatLngLiteral) => void,
    getGeofencesList: () => void,
    user: string,
    selectedItemIndex: number,
    setSelectedItemIndex: (item: number) => void,
    setGeofenceForm: (form: Nullable<Geofence>) => void
    geofenceForm: Nullable<Geofence>
    setVisibleGeofencePopup: (visible: boolean) => void
    visibleGeofencePopup: boolean,
}

interface GeofencingProviderProps {
    children: ReactNode;
}

export const GeofencingContext = createContext<GeofencingContextType | undefined>(undefined);


export const GeofencingProvider = ({ children }: GeofencingProviderProps) => {
  const [visibleGeofencePopup, setVisibleGeofencePopup] = useState(false);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [polygons, setPolygons] = useState<Array<Array<google.maps.LatLngLiteral>>>([[]]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const navigate = useNavigate();
  const defaultCenter: google.maps.LatLngLiteral = {
    lat: 32.9008968,
    lng: -117.2358298,
};
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(defaultCenter);
  const [user, setUser] = useState('');
  const [geofenceForm, setGeofenceForm] = useState<Nullable<Geofence>>();



  const getPolygon = React.useCallback(async (geofenceId: number) => {
    setPolygons([[]]);
    const response = await api.getGeofencesVertex(geofenceId)
    const { data } = response.data
    const extractedPolygon = data.map((item: GeofenceVertex) => ({ lat: item.latitude, lng: item.longitude}));
    const [firstPoint] =  extractedPolygon;
    extractedPolygon.push({ lat: firstPoint.lat, lng: firstPoint.lng })
    setPolygons([extractedPolygon])
    setCenter({ lat: firstPoint.lat, lng: firstPoint.lng })
  },[])

  

  const getGeofencesList =  React.useCallback(async () => {
    try {
      const response = await api.getGeofences();
      const { data } = response.data
      setGeofences(data);
    } catch (error) {
      if (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if(error.response && error.response.status && error.response.status  === 401){
          navigate('/401')
        // ts-ignore
      } 
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    setInterval(() => {
      getGeofencesList()
    },2000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
      const token  = getValueFromSessionStorage('token')
      if(token){
        const jwt =  getPayloadFromJwt(token)
        if(jwt && jwt.unique_name){
          setUser(jwt.unique_name);
        }
      }
  }, []);




  const contextValue: GeofencingContextType = {
    geofences,
    polygons,
    setPolygons,
    getPolygon,
    center,
    setCenter,
    getGeofencesList,
    user,
    selectedItemIndex,
    setSelectedItemIndex,
    setGeofenceForm,
    geofenceForm,
    setVisibleGeofencePopup,
    visibleGeofencePopup
  };

  return <GeofencingContext.Provider value={contextValue}>{children}</GeofencingContext.Provider>;
};


