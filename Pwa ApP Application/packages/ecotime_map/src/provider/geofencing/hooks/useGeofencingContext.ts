import { useContext } from "react";
import { GeofencingContext } from "../Provider";

export const useGeofencing = () => {
    const context = useContext(GeofencingContext);
    if (!context) {
      throw new Error('useGeofencingContext must be used within a GeofencingProvider');
    }
    return context;
};
  