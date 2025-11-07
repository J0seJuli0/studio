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
        <CardTitle className="text-lg">Delivery Stops</CardTitle>
        <p className="text-sm text-muted-foreground">
          Name your stops and click on the map to add them.
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
                    aria-label={`Destination ${index + 1} name`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => removeDestination(dest.id)}
                    aria-label={`Remove ${dest.name}`}
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
              Clear All Stops
            </Button>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4 border-dashed border-2 rounded-lg">
            Click on the map to add your first stop.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
