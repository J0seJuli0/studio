'use client';
import { useRoute } from '@/lib/context/route-context';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';

export function RouteOptimizationControls() {
  const {
    optimizeRoute,
    adjustRoute,
    isOptimizing,
    isReRouting,
    destinations,
    traffic,
    setTraffic,
    optimizedRoute,
  } = useRoute();

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="traffic-conditions">Condiciones del Tráfico</Label>
          <Select
            value={traffic}
            onValueChange={setTraffic}
            disabled={isOptimizing || isReRouting}
          >
            <SelectTrigger id="traffic-conditions">
              <SelectValue placeholder="Selecciona el tráfico..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Ligero</SelectItem>
              <SelectItem value="moderate">Moderado</SelectItem>
              <SelectItem value="heavy">Pesado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => optimizeRoute()}
            disabled={destinations.length < 2 || isOptimizing || isReRouting}
          >
            {isOptimizing && <Loader2 className="animate-spin mr-2" />}
            Optimizar Ruta
          </Button>
          <Button
            variant="secondary"
            onClick={() => adjustRoute()}
            disabled={!optimizedRoute || isReRouting || isOptimizing}
          >
            {isReRouting && <Loader2 className="animate-spin mr-2" />}
            Simular Tráfico y Re-rutear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
