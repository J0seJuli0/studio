'use client';
import { useRoute } from '@/lib/context/route-context';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { MapPin, Trash2, X } from 'lucide-react';

export function RoutePlanner() {
  const {
    destinations,
    removeDestination,
    clearDestinations,
    updateDestinationName,
  } = useRoute();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paradas de Entrega</CardTitle>
        <p className="text-sm text-muted-foreground">
          Nombra tus paradas y haz clic en el mapa para añadirlas.
        </p>
      </CardHeader>
      <CardContent>
        {destinations.length > 0 ? (
          <div className="space-y-2">
            <ul className="space-y-2">
              {destinations.map((dest, index) => (
                <li
                  key={dest.id}
                  className="flex items-center gap-2 group"
                >
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
            Haz clic en el mapa para añadir tu primera parada.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
