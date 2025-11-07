'use client';
import {
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  MapControl,
  ControlPosition,
} from '@vis.gl/react-google-maps';
import { useRoute } from '@/lib/context/route-context';
import { useCallback, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, LocateFixed } from 'lucide-react';

const Polyline = (props: google.maps.PolylineOptions) => {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!polyline) {
      setPolyline(new google.maps.Polyline(props));
    }
  }, [map, polyline, props]);

  useEffect(() => {
    if (!polyline) return;
    polyline.setMap(map);
    return () => {
      polyline.setMap(null);
    };
  }, [map, polyline]);

  useEffect(() => {
    if (!polyline) return;
    polyline.setOptions(props);
  }, [polyline, props]);

  return null;
};

const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick: (e: google.maps.MapMouseEvent) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', onMapClick);
    return () => google.maps.event.removeListener(listener);
  }, [map, onMapClick]);

  return null;
};

export function MapView({ apiKey }: { apiKey?: string }) {
  const {
    destinations,
    addDestination,
    optimizedRoute,
    currentLocation,
    isGettingLocation,
  } = useRoute();
  const [routePath, setRoutePath] = useState<
    google.maps.LatLngLiteral[] | null
  >(null);
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();

  useEffect(() => {
    if (routesLibrary) {
      setDirectionsService(new routesLibrary.DirectionsService());
    }
  }, [routesLibrary]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const { lat, lng } = event.latLng;
      const newDestName = `Destino ${destinations.length + 1}`;
      addDestination({ name: newDestName, lat: lat(), lng: lng() });
    }
  };

  const traceRoute = useCallback(() => {
    if (
      !directionsService ||
      !optimizedRoute ||
      !optimizedRoute.optimizedRoute ||
      optimizedRoute.optimizedRoute.length < 2
    ) {
      setRoutePath(null);
      return;
    }

    const waypoints = optimizedRoute.optimizedRoute
      .slice(1, -1)
      .map(stop => ({
        location: { lat: stop.latitude, lng: stop.longitude },
      }));

    const request: google.maps.DirectionsRequest = {
      origin: {
        lat: optimizedRoute.optimizedRoute[0].latitude,
        lng: optimizedRoute.optimizedRoute[0].longitude,
      },
      destination: {
        lat: optimizedRoute.optimizedRoute[
          optimizedRoute.optimizedRoute.length - 1
        ].latitude,
        lng: optimizedRoute.optimizedRoute[
          optimizedRoute.optimizedRoute.length - 1
        ].longitude,
      },
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        const path = result.routes[0].overview_path.map(p => ({
          lat: p.lat(),
          lng: p.lng(),
        }));
        setRoutePath(path);
      }
    });
  }, [directionsService, optimizedRoute]);

  useEffect(() => {
    if (optimizedRoute) {
      traceRoute();
    } else {
      setRoutePath(null);
    }
  }, [optimizedRoute, traceRoute]);

  const map = useMap();
  useEffect(() => {
    if (map && currentLocation) {
      map.panTo(currentLocation);
      map.setZoom(14);
    }
  }, [map, currentLocation]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Falta la clave de API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Falta la clave de API de Google Maps. Agrégala a tus variables de
              entorno para mostrar el mapa. Consulta el archivo{' '}
              <code className="bg-muted-foreground/20 px-1 py-0.5 rounded">
                .env.local
              </code>{' '}
              para obtener instrucciones.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Map
      defaultCenter={{ lat: 40.7128, lng: -74.006 }}
      defaultZoom={10}
      mapId="optimal-route-map"
      gestureHandling="greedy"
      className="w-full h-full border-none"
    >
      <MapClickHandler onMapClick={handleMapClick} />
      {currentLocation && (
        <AdvancedMarker position={currentLocation}>
          <Pin
            background={'hsl(var(--accent))'}
            borderColor={'hsl(var(--accent-foreground))'}
            glyphColor={'hsl(var(--accent-foreground))'}
          >
            <LocateFixed
              className={isGettingLocation ? 'animate-pulse' : ''}
            />
          </Pin>
        </AdvancedMarker>
      )}

      {destinations.map((dest, index) => (
        <AdvancedMarker
          key={dest.id}
          position={{ lat: dest.lat, lng: dest.lng }}
        >
          <Pin
            background={'hsl(var(--primary))'}
            borderColor={'hsl(var(--primary-foreground))'}
            glyphColor={'hsl(var(--primary-foreground))'}
          >
            {index + 1}
          </Pin>
        </AdvancedMarker>
      ))}

      {routePath && (
        <Polyline
          path={routePath}
          strokeColor={'hsl(var(--accent))'}
          strokeOpacity={0.9}
          strokeWeight={5}
        />
      )}
    </Map>
  );
}
