import { Resource } from 'common/types/types';
import { getResourcesInPolygon } from 'core/geolocation/selectors';
import { ResourceInPolygon } from 'core/geolocation/types';
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Nullable } from 'types/common';

export default function useGeofencingResources(resourceId: Resource) {
  const resourcesInPolygon = useSelector(getResourcesInPolygon);
  const [resourceInPolygon, setResourceInPolygon] = useState<Nullable<ResourceInPolygon>>(null);

  useLayoutEffect(() => {
    if (resourcesInPolygon
      && resourcesInPolygon.length
      && resourcesInPolygon.length > 0) {
      const resourceInPolygon = resourcesInPolygon.find((item: ResourceInPolygon) => item.resourceId === resourceId);
      if (resourceInPolygon) {
        setResourceInPolygon(resourceInPolygon);
      } else {
        setResourceInPolygon(null);
      }
    } else {
      setResourceInPolygon(null);
    }
  }, [JSON.stringify(resourcesInPolygon)]);

  return resourceInPolygon;
}
