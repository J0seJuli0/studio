'use client';

import { MainLayout } from '@/components/main-layout';
import { RouteProvider } from '@/lib/context/route-context';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function Home() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={googleMapsApiKey} libraries={['marker', 'routes']}>
      <RouteProvider>
        <MainLayout googleMapsApiKey={googleMapsApiKey} />
      </RouteProvider>
    </APIProvider>
  );
}
