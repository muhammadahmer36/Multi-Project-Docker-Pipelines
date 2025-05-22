import { GeofenceRestriction, Resource } from 'common/types/types';
import { useSelector } from 'react-redux';
import { getPositionError } from 'core/geolocation/selectors';
import useGeofencingResources from './useGeofencingResource';

interface Props {
  resourceId: Resource,
  children: React.ReactNode
}

export default function GeofencingResources(props: Props) {
  const { resourceId, children } = props;
  const resourceInPolygon = useGeofencingResources(resourceId);
  const positionError = useSelector(getPositionError);

  const isLocationValid = resourceInPolygon?.isLocationValid;
  const geofenceModeId = resourceInPolygon?.geofenceMode.id;

  if ((isLocationValid
    || geofenceModeId === GeofenceRestriction.Warning
    || geofenceModeId === GeofenceRestriction.Allowed
    || resourceInPolygon === null)
    && !(positionError && geofenceModeId === GeofenceRestriction.FullRestriction)) {
    return children as React.ReactElement;
  }

  return null;
}
