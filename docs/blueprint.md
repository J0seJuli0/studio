# **App Name**: OptimalRoute

## Core Features:

- Order Input: Allow users to input multiple order destinations, defining each delivery stop.
- Route Optimization: Use algorithms to determine the most efficient delivery route, considering distance, time, and traffic using the Google Maps API. Incorporate a 'tool' powered by an LLM to weigh all factors when picking which branch of the algorithm to use for route generation.
- Route Visualization: Display the optimized route on a map using the Google Maps API, showing the order of deliveries.
- Dynamic Re-routing: Adjust the route in real-time based on updated traffic conditions obtained from Google Maps API, recalculating the optimal path.
- Data Persistence: Data will be managed in JSON format on the client-side.

## Style Guidelines:

- Primary color: Blue (#4285F4) to represent reliability and navigation.
- Background color: Light gray (#F5F5F5), a desaturated hue of the primary.
- Accent color: Green (#34A853) to indicate optimal routes or completed tasks.
- Body and headline font: 'Inter', a sans-serif for a modern and readable interface.
- Use clear, recognizable icons for destinations and route indicators.
- Prioritize a clean, map-centric layout that focuses on route visualization.
- Use subtle animations to highlight route changes and updates in real-time.