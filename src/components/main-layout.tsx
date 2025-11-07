'use client';
import { AppLogo } from '@/components/icons';
import { MapView } from '@/components/map-view';
import { RouteDetails } from '@/components/route-details';
import { RouteOptimizationControls } from '@/components/route-optimization-controls';
import { RoutePlanner } from '@/components/route-planner';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useRoute } from '@/lib/context/route-context';

export function MainLayout({
  googleMapsApiKey,
}: {
  googleMapsApiKey?: string;
}) {
  const { optimizedRoute } = useRoute();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo />
            <h1 className="text-xl font-semibold">Ruta Óptima</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex flex-col gap-4">
          <RoutePlanner />
          <RouteOptimizationControls />
          {optimizedRoute && <RouteDetails />}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="absolute top-2 left-2 z-10 p-1 bg-background/50 backdrop-blur-sm rounded-md border">
          <SidebarTrigger />
        </header>
        <MapView apiKey={googleMapsApiKey} />
      </SidebarInset>
    </SidebarProvider>
  );
}
