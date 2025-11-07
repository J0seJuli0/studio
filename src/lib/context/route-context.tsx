'use client';
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import type { Destination, RouteResult } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { adjustRouteAction, optimizeRouteAction } from '../actions';
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

  const handleOptimizeRoute = async () => {
    if (destinations.length < 2) {
      toast({
        title: 'Destinos insuficientes',
        description: 'Añade al menos dos paradas para optimizar una ruta.',
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
        latitude: destinations[0].lat,
        longitude: destinations[0].lng,
      },
      trafficConditions: traffic,
    };

    const result = await optimizeRouteAction(input);
    if (result.success) {
      setOptimizedRoute(result.data);
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
        description: 'Por favor, optimiza una ruta antes de intentar re-rutear.',
        variant: 'destructive',
      });
      return;
    }

    setIsReRouting(true);
    // This is a mock simulation of a sudden traffic change.
    const newTrafficCondition =
      traffic === 'heavy' ? 'light' : traffic === 'moderate' ? 'heavy' : 'moderate';

    setTraffic(newTrafficCondition);

    const input = {
      destinations: optimizedRoute.optimizedRoute.map(
        ({ name, latitude, longitude }) => ({ name, latitude, longitude })
      ),
      currentLocation: {
        latitude: optimizedRoute.optimizedRoute[0].latitude,
        longitude: optimizedRoute.optimizedRoute[0].longitude,
      },
      trafficConditions: newTrafficCondition,
    };

    const result = await optimizeRouteAction(input);

    if (result.success && result.data) {
      setOptimizedRoute(result.data);
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
      // Revert traffic condition if rerouting fails
      setTraffic(traffic);
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
