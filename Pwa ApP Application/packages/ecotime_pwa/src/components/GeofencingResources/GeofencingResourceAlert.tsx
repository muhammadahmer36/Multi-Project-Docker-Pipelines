import { GeofenceRestriction, Resource } from 'common/types/types';
import { Severity } from 'components/Alert/types';
import Alert from 'components/Alert';
import useGeofencingResources from './useGeofencingResource';

interface Props {
    resourceId: Resource
}

interface RestrictionSeverity {
  [key: number]: string
}

export default function GeofencingResourceAlert(props: Props) {
  const { resourceId } = props;
  const resourceInPolygon = useGeofencingResources(resourceId);

  const isLocationValid = resourceInPolygon?.isLocationValid;
  const geofenceModeId = resourceInPolygon?.geofenceMode.id;

  const severity: RestrictionSeverity = {
    1: Severity.ERROR,
    2: Severity.WARNING,
  };

  if (resourceInPolygon && isLocationValid === false && geofenceModeId !== GeofenceRestriction.Allowed) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { geofenceMode } = resourceInPolygon;
    const { applicationMessage, id } = geofenceMode;
    return (
      <Alert severity={severity[id] as Severity}>
        {applicationMessage}
      </Alert>

    );
  }

  return null;
}
