'use client';
import { useRoute } from '@/lib/context/route-context';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { LocateFixed, MapPin, Trash2, X, Loader2 } from 'lucide-react';

export function RoutePlanner() {
  const {
    destinations,
    removeDestination,
    clearDestinations,
    updateDestinationName,
    getCurrentLocation,
    isGettingLocation,
    currentLocation,
  } = useRoute();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Planificador de Ruta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="w-full"
          variant={currentLocation ? 'secondary' : 'default'}
        >
          {isGettingLocation ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LocateFixed />
          )}
          {currentLocation
            ? 'Actualizar Punto de Partida'
            : 'Usar Mi Ubicación Actual'}
        </Button>
        <div>
          <h3 className="text-md font-medium mb-2">Paradas de Entrega</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Haz clic en el mapa para añadir una parada.
          </p>
          {destinations.length > 0 ? (
            <div className="space-y-2">
              <ul className="space-y-2">
                {destinations.map((dest, index) => (
                  <li key={dest.id} className="flex items-center gap-2 group">
                    <MapPin className="size-4 text-muted-foreground" />
                    <Input
                      value={dest.name}
                      onChange={e =>
                        updateDestinationName(dest.id, e.target.value)
                      }
                      className="h-8 flex-1"
                      aria-label={`Nombre del destino ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => removeDestination(dest.id)}
                      aria-label={`Eliminar ${dest.name}`}
                    >
                      <X className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearDestinations}
              >
                <Trash2 className="mr-2 size-4" />
                Limpiar Todas las Paradas
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4 border-dashed border-2 rounded-lg">
              Añade tu primera parada haciendo clic en el mapa.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
