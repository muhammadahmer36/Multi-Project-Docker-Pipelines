import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Libraries, Polygon, useJsApiLoader } from '@react-google-maps/api';
import GeofencePopup from 'components/common/GeofencePopup';
import { GeofenceForm } from 'components/common/GeofencePopup/types';
import * as api from 'api/client';
import { Geofence } from 'api/types';
import { useGeofencing } from 'provider/geofencing/hooks';
import { useSnackbar } from 'provider/snackbar/hooks';

const libraries: Libraries = ['places', 'drawing'];

const VITE_MAP_KEY = import.meta.env.VITE_MAP_KEY;
const polygonError = 'A geofence should have 4 sides/vertices only.'

const MapComponent = () => {

    const mapRef = useRef<google.maps.Map | null>(null);
    const polygonsRefs = useRef<google.maps.Polygon[]>([]);
    const polygonRefs = useRef<google.maps.LatLngLiteral[]>([]);
    const activePolygonIndex = useRef<number | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
    const {
        polygons,
        setPolygons,
        getGeofencesList,
        getPolygon,
        user,
        geofences,
        setSelectedItemIndex,
        visibleGeofencePopup,
        geofenceForm,
        setGeofenceForm,
        setVisibleGeofencePopup } = useGeofencing()
    const { showSnackbar } = useSnackbar();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: VITE_MAP_KEY,
        libraries
    });
    const defaultCenter: google.maps.LatLngLiteral = {
        lat: 32.9008968,
        lng: -117.2358298,
    };
    const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(defaultCenter);

    useEffect(() => {
        if (polygons[0].length > 1 && mapRef.current) {
            const firstPolygon = polygons[0];
            const bounds = new window.google.maps.LatLngBounds();
            firstPolygon.forEach(point => bounds.extend(point));

            const map = mapRef.current;

            map.fitBounds(bounds, 10);
        }
    }, [polygons]);



    const savePolygon = async (geofenceForm: GeofenceForm) => {
        try {
            const geofence = {
                ...geofenceForm,
                actionUser: user
            };

            if (polygonRefs.current && polygonRefs.current.length > 0) {
                const response = await api.postGeofences(geofence as Geofence);
                const { data, validation } = response.data;
                const { id: geofenceId } = data;
                for (const { lat, lng } of polygonRefs.current) {
                    await api.postGeofencesVertex({
                        latitude: lat,
                        longitude: lng,
                        actionuser: user,
                        geofenceId,
                    });
                }
                polygonRefs.current = []
                getGeofencesList();
                getPolygon(geofenceId)
                if (validation) {
                    showSnackbar(validation.statusMessage, 'success');
                }
                setTimeout(() => {
                    setSelectedItemIndex(geofences.length)
                }, 0)

            }


        } catch (error) {
            // Handle error
        }

    }

    const updatePolygon = async (geofence: Geofence) => {
        try {
            const response = await api.updateGeofences(geofence);
            const { validation } = response.data;
            if (validation) {
                showSnackbar(validation.statusMessage, 'success');
                setGeofenceForm(null);
            }
        } catch (error) {
            // Handle error
        }
    }

    const onClose = () => {
        setVisibleGeofencePopup(false);
        setTimeout(() => {
            setGeofenceForm(null);
        }, 500)

    }

    const onSave = (geofenceForm: GeofenceForm) => {
        setVisibleGeofencePopup(false);
        savePolygon(geofenceForm);
    }

    const onUpdate = (geofence: Geofence) => {
        setVisibleGeofencePopup(false);
        updatePolygon(geofence)
    }


    const containerStyle = {
        width: '100%',
        height: '100%',
    }

    const autocompleteStyle: React.CSSProperties = {
        boxSizing: 'border-box',
        border: '1px solid transparent',
        width: '240px',
        height: '38px',
        padding: '0 12px',
        borderRadius: '3px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        fontSize: '14px',
        outline: 'none',
        textOverflow: 'ellipses',
        position: 'absolute',
        right: '8%',
        top: '11px',
        marginLeft: '-120px',
    }

    const polygonOptions: google.maps.PolygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: false,
        editable: false,
    };

    const drawingManagerOptions: google.maps.drawing.DrawingManagerOptions = {
        polygonOptions: polygonOptions,
        drawingControl: true,
        drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_CENTER,
            drawingModes: [
                window.google?.maps?.drawing?.OverlayType?.POLYGON,
            ],
        },
    };

    const onLoadMap = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const onLoadPolygon = (polygon: google.maps.Polygon, index: number) => {
        polygonsRefs.current[index] = polygon;
    }

    const onClickPolygon = (index: number) => {
        activePolygonIndex.current = index;
    }

    const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };


    const onPlaceChanged = () => {
        if (mapRef.current) {
            const { geometry } = autocompleteRef.current?.getPlace() || {};
            const bounds = new window.google.maps.LatLngBounds();
            if (geometry?.viewport) {
                bounds.union(geometry.viewport);
            } else {
                bounds.extend(geometry?.location as google.maps.LatLng);
            }
            mapRef.current?.fitBounds(bounds); // Adjust the max and min zoom levels as needed


        }
    };

    const onLoadDrawingManager = (drawingManager: google.maps.drawing.DrawingManager) => {
        drawingManagerRef.current = drawingManager;
    };

    const onOverlayComplete = ($overlayEvent: google.maps.drawing.OverlayCompleteEvent) => {
        drawingManagerRef.current?.setDrawingMode(null);
        if ($overlayEvent.type === window.google?.maps?.drawing?.OverlayType?.POLYGON) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const newPolygon = $overlayEvent.overlay?.getPath().getArray()
                .map((latLng: google.maps.LatLng) => ({ lat: latLng.lat(), lng: latLng.lng() })) || [];
            $overlayEvent.overlay?.setMap(null);
            polygonRefs.current = [...newPolygon];
            if (newPolygon.length === 4) {
                setVisibleGeofencePopup(true)
            }
            else {
                showSnackbar(polygonError, 'error');
            }
        }

    };

    const onEditPolygon = (index: number) => {
        const polygonRef = polygonsRefs.current[index];
        if (polygonRef) {
            const coordinates = polygonRef.getPath()
                .getArray()
                .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));

            const allPolygons = [...polygons];
            allPolygons[index] = coordinates;
            setPolygons(allPolygons)
        }
    }


    return (
        isLoaded
            ?
            <>
                <GoogleMap
                    zoom={5}
                    center={center as google.maps.LatLngLiteral}
                    onLoad={onLoadMap}
                    mapContainerStyle={containerStyle}
                    onTilesLoaded={() => setCenter(null)}

                    options={{
                        streetViewControl: false,
                        fullscreenControl: false,
                        zoomControl: false,
                    }}
                >
                    <DrawingManager
                        onLoad={onLoadDrawingManager}
                        onOverlayComplete={onOverlayComplete}
                        options={drawingManagerOptions}
                    />
                    {
                        polygons.map((iterator, index) => (
                            <Polygon
                                key={index}
                                onLoad={(event) => onLoadPolygon(event, index)}
                                onMouseDown={() => onClickPolygon(index)}
                                onMouseUp={() => onEditPolygon(index)}
                                onDragEnd={() => onEditPolygon(index)}
                                options={polygonOptions}
                                paths={iterator}

                            />
                        ))
                    }
                    <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type='text'
                            placeholder='Search Location'
                            style={autocompleteStyle}
                        />
                    </Autocomplete>
                    <GeofencePopup
                        open={visibleGeofencePopup}
                        onSave={onSave}
                        onClose={onClose}
                        onUpdate={onUpdate}
                        data={geofenceForm as Geofence}
                    />
                </GoogleMap>
            </>
            :
            null
    );
}

const App = React.memo(MapComponent)
export default App