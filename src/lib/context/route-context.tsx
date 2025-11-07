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
        title: 'Not enough destinations',
        description: 'Please add at least two stops to optimize a route.',
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
        title: 'Route Optimized!',
        description: 'The most efficient route has been calculated.',
        variant: 'default',
        className: 'bg-accent border-accent text-accent-foreground',
      });
    } else {
      toast({
        title: 'Optimization Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsOptimizing(false);
  };

  const handleAdjustRoute = async () => {
    if (!optimizedRoute) {
      toast({
        title: 'No active route',
        description: 'Please optimize a route before trying to re-route.',
        variant: 'destructive',
      });
      return;
    }

    setIsReRouting(true);
    const newTrafficCondition = 'heavy'; // Simulate sudden heavy traffic

    const input = {
      currentRoute: JSON.stringify(optimizedRoute.optimizedRoute),
      trafficConditions: JSON.stringify({ status: newTrafficCondition }),
      alternativeRoutes: JSON.stringify([]), // Let the AI figure it out
    };

    const result = await adjustRouteAction(input);

    if (result.success && result.data) {
      try {
        const newRoute = JSON.parse(result.data.adjustedRoute);
        setOptimizedRoute({
          optimizedRoute: newRoute,
          reasoning: result.data.reason,
        });
        toast({
          title: 'Route Adjusted!',
          description: `Route updated for ${newTrafficCondition} traffic.`,
          variant: 'default',
          className: 'bg-accent border-accent text-accent-foreground',
        });
      } catch (e) {
        toast({
          title: 'Adjustment Failed',
          description: 'AI returned an invalid route format.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Adjustment Failed',
        description: result.error,
        variant: 'destructive',
      });
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
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
}
