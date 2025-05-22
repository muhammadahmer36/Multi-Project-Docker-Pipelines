
export const BASE_URL = import.meta.env.VITE_REACT_APP_URL;

export const API_URLS = {
  geofence: `${BASE_URL}/api/Geo/Geofence`,
  updateGeofence: `${BASE_URL}/api/Geo/UpdateGeofence`,
  geoenceVertex: `${BASE_URL}/api/Geo/GeofenceVertex`,
};
