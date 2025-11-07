'use client';
import { useRoute } from '@/lib/context/route-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bot, CheckCircle, MapPin } from 'lucide-react';

export function RouteDetails() {
  const { optimizedRoute, isReRouting } = useRoute();

  if (!optimizedRoute) return null;

  const routeStops = optimizedRoute.optimizedRoute;

  return (
    <Card className={isReRouting ? 'animate-pulse' : ''}>
      <CardHeader>
        <CardTitle className="text-lg">Ruta Optimizada</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-3">
          {routeStops.map((stop, index) => (
            <li key={stop.name} className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center size-6 rounded-full text-sm font-bold ${
                  index === routeStops.length - 1
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {index + 1}
              </span>
              <span className="flex-1 truncate">{stop.name}</span>
              {index === routeStops.length - 1 && (
                <CheckCircle className="size-5 text-accent" />
              )}
            </li>
          ))}
        </ol>

        <div className="bg-primary/10 p-3 rounded-lg">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <Bot className="size-4" />
            Razonamiento de la IA
          </h4>
          <p className="text-sm text-foreground/80">
            {optimizedRoute.reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
