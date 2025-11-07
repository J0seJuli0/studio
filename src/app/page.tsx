import { MainLayout } from '@/components/main-layout';
import { RouteProvider } from '@/lib/context/route-context';

export default function Home() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <RouteProvider>
      <MainLayout googleMapsApiKey={googleMapsApiKey} />
    </RouteProvider>
  );
}
