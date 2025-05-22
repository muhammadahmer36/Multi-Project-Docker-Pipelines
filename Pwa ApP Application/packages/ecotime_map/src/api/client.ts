import axios from 'axios';
import { API_URLS, BASE_URL } from './config';
import { Geofence, GeofenceVertex } from './types';
import { getValueFromSessionStorage } from 'core/utils';

const customConfig = {
  baseURL: BASE_URL,
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
  },
};

const httpClient = axios.create(customConfig);

httpClient.interceptors.request.use(async (config) => {
  const token = await getValueFromSessionStorage('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getGeofences = () => {
  return httpClient.get(`${API_URLS.geofence}`);
};

export const getGeofencesVertex = (geofenceId: number) => {
  return httpClient.get(`${API_URLS.geoenceVertex}?GeofenceId=${geofenceId}`);
};

export const postGeofences = (geoence: Geofence) => {
return httpClient.post(API_URLS.geofence, geoence);
};
  
export const postGeofencesVertex = (geoenceVertex: GeofenceVertex) => {
   return httpClient.post(API_URLS.geoenceVertex, geoenceVertex);
};

export const deleteGeofencesVertex = (Id: number) => {
  return httpClient.delete(`${API_URLS.geofence}?geofenceId=${Id}`);
};

export const updateGeofences = (geofence: Geofence) => {
  return httpClient.post(API_URLS.updateGeofence, geofence);
};
