'use server';

/**
 * @fileOverview Optimizes delivery routes based on factors like distance, time, and traffic using an LLM to select the best algorithmic approach.
 *
 * - optimizeRouteBasedOnFactors - A function that optimizes routes based on various factors.
 * - OptimizeRouteBasedOnFactorsInput - The input type for the optimizeRouteBasedOnFactors function.
 * - OptimizeRouteBasedOnFactorsOutput - The return type for the optimizeRouteBasedOnFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteBasedOnFactorsInputSchema = z.object({
  destinations: z.array(
    z.object({
      latitude: z.number().describe('Latitude of the destination.'),
      longitude: z.number().describe('Longitude of the destination.'),
      name: z.string().describe('Name or identifier for the destination.'),
    })
  ).describe('An array of delivery destinations with latitude, longitude, and name.'),
  currentLocation: z.object({
    latitude: z.number().describe('Current latitude of the delivery vehicle.'),
    longitude: z.number().describe('Current longitude of the delivery vehicle.'),
  }).describe('The current location of the delivery vehicle.'),
  trafficConditions: z.string().describe('Current traffic conditions (e.g., light, moderate, heavy).'),
});

export type OptimizeRouteBasedOnFactorsInput = z.infer<typeof OptimizeRouteBasedOnFactorsInputSchema>;

const OptimizeRouteBasedOnFactorsOutputSchema = z.object({
  optimizedRoute: z.array(
    z.object({
      name: z.string().describe('Name or identifier of the destination.'),
      latitude: z.number().describe('Latitude of the destination.'),
      longitude: z.number().describe('Longitude of the destination.'),
    })
  ).describe('The optimized route with destinations in the recommended order.'),
  reasoning: z.string().describe('Explanation of why this route was chosen.'),
});

export type OptimizeRouteBasedOnFactorsOutput = z.infer<typeof OptimizeRouteBasedOnFactorsOutputSchema>;


async function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number> {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}

async function estimateTravelTime(distance: number, trafficConditions: string): Promise<number> {
  // This is a simplified model; in a real application, this would use
  // the Google Maps Distance Matrix API or similar.
  let speed = 60; // km/h, default speed

  switch (trafficConditions) {
    case 'moderate':
      speed = 40;
      break;
    case 'heavy':
      speed = 20;
      break;
    default:
      speed = 60;
  }

  const time = distance / speed; // Time in hours
  return time;
}

const chooseAlgorithm = ai.defineTool(
  {
    name: 'chooseAlgorithm',
    description: 'Chooses the best algorithm based on the current conditions to optimize the delivery route.',
    inputSchema: z.object({
      trafficConditions: z.string().describe('Current traffic conditions (e.g., light, moderate, heavy).'),
      numDestinations: z.number().describe('The number of delivery destinations.'),
    }),
    outputSchema: z.string().describe('The name of the algorithm to use (e.g., "greedy", "heuristic").'),
  },
  async (input) => {
    // In a real application, this could use a more sophisticated model.
    if (input.trafficConditions === 'heavy' || input.numDestinations > 10) {
      return 'heuristic';
    }
    return 'greedy';
  }
);

export async function optimizeRouteBasedOnFactors(input: OptimizeRouteBasedOnFactorsInput): Promise<OptimizeRouteBasedOnFactorsOutput> {
  return optimizeRouteBasedOnFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRoutePrompt',
  tools: [chooseAlgorithm],
  input: {schema: OptimizeRouteBasedOnFactorsInputSchema},
  output: {schema: OptimizeRouteBasedOnFactorsOutputSchema},
  prompt: `You are an expert route optimizer for delivery services. Given the current location, a list of destinations with their names and coordinates, and current traffic conditions, determine the most efficient delivery route. Weigh distance, time, and traffic when picking which branch of the algorithm to use for route generation.

You must use the chooseAlgorithm tool to determine which algorithm to use.

Destinations: {{{JSON.stringify(destinations)}}}
Current Location: {{{JSON.stringify(currentLocation)}}}
Traffic Conditions: {{{trafficConditions}}}

Output the optimized route as an ordered list of destinations with name, latitude, and longitude and explain the reasoning behind the chosen route.
`,
});

const optimizeRouteBasedOnFactorsFlow = ai.defineFlow(
  {
    name: 'optimizeRouteBasedOnFactorsFlow',
    inputSchema: OptimizeRouteBasedOnFactorsInputSchema,
    outputSchema: OptimizeRouteBasedOnFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
