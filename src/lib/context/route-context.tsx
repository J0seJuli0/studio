'use client';
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import type { Destination, Location, RouteResult } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { optimizeRouteAction } from '../actions';
import { nanoid } from 'nanoid';

interface RouteContextType {
  destinations: Destination[];
  addDestination: (dest: Omit<Destination, 'id'>) => void;
  removeDestination: (id: string) => void;
  clearDestinations: () => void;
  updateDestinationName: (id: string, name: string) => void;
  optimizedRoute: RouteResult | null;
  setOptimizedRoute: (route: RouteResult | null) => void;
  traffic: string;
  setTraffic: (traffic: string) => void;
  isOptimizing: boolean;
  isReRouting: boolean;
  optimizeRoute: () => Promise<void>;
  adjustRoute: () => Promise<void>;
  currentLocation: Location | null;
  getCurrentLocation: () => void;
  isGettingLocation: boolean;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useLocalStorage<Destination[]>(
    'optimal-route-destinations',
    []
  );
  const [optimizedRoute, setOptimizedRoute] = useState<RouteResult | null>(
    null
  );
  const [traffic, setTraffic] = useState('moderate');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isReRouting, setIsReRouting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const addDestination = useCallback(
    (dest: Omit<Destination, 'id'>) => {
      setDestinations(prev => [...prev, { ...dest, id: nanoid() }]);
      setOptimizedRoute(null);
    },
    [setDestinations]
  );

  const removeDestination = useCallback(
    (id: string) => {
      setDestinations(prev => prev.filter(d => d.id !== id));
      setOptimizedRoute(null);
    },
    [setDestinations]
  );

  const clearDestinations = useCallback(() => {
    setDestinations([]);
    setOptimizedRoute(null);
  }, [setDestinations]);

  const updateDestinationName = useCallback(
    (id: string, name: string) => {
      setDestinations(prev =>
        prev.map(d => (d.id === id ? { ...d, name } : d))
      );
    },
    [setDestinations]
  );

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocalización no soportada',
        description: 'Tu navegador no permite obtener la ubicación actual.',
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setIsGettingLocation(false);
        toast({
          title: 'Ubicación obtenida',
          description: 'Se usará tu ubicación actual como punto de partida.',
        });
      },
      error => {
        console.error(error);
        setIsGettingLocation(false);
        toast({
          title: 'Error al obtener ubicación',
          description:
            'No se pudo acceder a tu ubicación. Asegúrate de tener los permisos activados.',
          variant: 'destructive',
        });
      }
    );
  };

  const handleOptimizeRoute = async () => {
    if (!currentLocation) {
      toast({
        title: 'Falta el punto de partida',
        description:
          'Por favor, permite el acceso a tu ubicación para definir el punto de partida.',
        variant: 'destructive',
      });
      return;
    }

    if (destinations.length < 1) {
      toast({
        title: 'Destinos insuficientes',
        description: 'Añade al menos una parada para optimizar una ruta.',
        variant: 'destructive',
      });
      return;
    }
    setIsOptimizing(true);
    setOptimizedRoute(null);

    const input = {
      destinations: destinations.map(({ name, lat, lng }) => ({
        name,
        latitude: lat,
        longitude: lng,
      })),
      currentLocation: {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      },
      trafficConditions: traffic,
    };

    const result = await optimizeRouteAction(input);
    if (result.success) {
      // The AI response includes the start point, so we show it in the UI.
      const routeWithStartPoint = {
        ...result.data,
        optimizedRoute: [
          {
            name: 'Punto de Partida',
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          },
          ...result.data.optimizedRoute,
        ],
      };
      setOptimizedRoute(routeWithStartPoint);
      toast({
        title: '¡Ruta Optimizada!',
        description: 'Se ha calculado la ruta más eficiente.',
        variant: 'default',
        className: 'bg-accent border-accent text-accent-foreground',
      });
    } else {
      toast({
        title: 'Falló la Optimización',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsOptimizing(false);
  };

  const handleAdjustRoute = async () => {
    if (!optimizedRoute) {
      toast({
        title: 'No hay ruta activa',
        description:
          'Por favor, optimiza una ruta antes de intentar re-rutear.',
        variant: 'destructive',
      });
      return;
    }

    setIsReRouting(true);
    const newTrafficCondition =
      traffic === 'heavy'
        ? 'light'
        : traffic === 'moderate'
        ? 'heavy'
        : 'moderate';

    setTraffic(newTrafficCondition);

    const startPoint = optimizedRoute.optimizedRoute[0];
    const destinationsToReoptimize = optimizedRoute.optimizedRoute.slice(1);

    const input = {
      destinations: destinationsToReoptimize.map(
        ({ name, latitude, longitude }) => ({ name, latitude, longitude })
      ),
      currentLocation: {
        latitude: startPoint.latitude,
        longitude: startPoint.longitude,
      },
      trafficConditions: newTrafficCondition,
    };

    const result = await optimizeRouteAction(input);

    if (result.success && result.data) {
      const routeWithStartPoint = {
        ...result.data,
        optimizedRoute: [startPoint, ...result.data.optimizedRoute],
      };
      setOptimizedRoute(routeWithStartPoint);
      toast({
        title: '¡Ruta Re-calculada!',
        description: `Ruta actualizada para tráfico ${newTrafficCondition}.`,
        variant: 'default',
        className: 'bg-accent border-accent text-accent-foreground',
      });
    } else {
      toast({
        title: 'Falló el Re-cálculo',
        description: result.error,
        variant: 'destructive',
      });
      setTraffic(traffic); // Revert traffic
    }

    setIsReRouting(false);
  };

  return (
    <RouteContext.Provider
      value={{
        destinations,
        addDestination,
        removeDestination,
        clearDestinations,
        updateDestinationName,
        optimizedRoute,
        setOptimizedRoute,
        traffic,
        setTraffic,
        isOptimizing,
        isReRouting,
        optimizeRoute: handleOptimizeRoute,
        adjustRoute: handleAdjustRoute,
        currentLocation,
        getCurrentLocation,
        isGettingLocation,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute(): RouteContextType {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRoute debe ser usado dentro de un RouteProvider');
  }
  return context;
}
