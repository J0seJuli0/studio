export type Destination = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type OptimizedStop = {
  name: string;
  latitude: number;
  longitude: number;
};

export type RouteResult = {
  optimizedRoute: OptimizedStop[];
  reasoning: string;
};
