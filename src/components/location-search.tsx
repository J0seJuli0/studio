'use client';
import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { useRoute } from '@/lib/context/route-context';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export function LocationSearch() {
  const map = useMap();
  const places = useMapsLibrary('places');
  const { addDestination } = useRoute();
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const ac = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    });

    setAutocomplete(ac);
  }, [places]);

  useEffect(() => {
    if (!autocomplete || !map) return;

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (
        !place.geometry ||
        !place.geometry.location ||
        !place.formatted_address
      ) {
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      addDestination({
        name: place.name || place.formatted_address,
        lat,
        lng,
      });

      map.setCenter({ lat, lng });
      map.setZoom(15);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    });
    return () => {
      listener.remove();
    };
  }, [autocomplete, addDestination, map]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Buscar una dirección..."
        className="pl-9"
      />
    </div>
  );
}
