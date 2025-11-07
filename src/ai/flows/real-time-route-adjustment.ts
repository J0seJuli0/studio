'use server';

/**
 * @fileOverview Adjusts the delivery route in real-time based on updated traffic conditions.
 *
 * - adjustRoute - A function that handles the real-time route adjustment process.
 * - AdjustRouteInput - The input type for the adjustRoute function.
 * - AdjustRouteOutput - The return type for the adjustRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustRouteInputSchema = z.object({
  currentRoute: z.string().describe('The current route as a serialized JSON string.'),
  trafficConditions: z.string().describe('The latest traffic conditions as a serialized JSON string.'),
  alternativeRoutes: z.string().describe('The alternative routes as a serialized JSON string.'),
});
export type AdjustRouteInput = z.infer<typeof AdjustRouteInputSchema>;

const AdjustRouteOutputSchema = z.object({
  adjustedRoute: z.string().describe('The adjusted route as a serialized JSON string.'),
  reason: z.string().describe('The reason for the route adjustment.'),
});
export type AdjustRouteOutput = z.infer<typeof AdjustRouteOutputSchema>;

export async function adjustRoute(input: AdjustRouteInput): Promise<AdjustRouteOutput> {
  return adjustRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustRoutePrompt',
  input: {schema: AdjustRouteInputSchema},
  output: {schema: AdjustRouteOutputSchema},
  prompt: `You are a route optimization expert. Given the current route, traffic conditions, and alternative routes, determine the best adjusted route.

Current Route: {{{currentRoute}}}

Traffic Conditions: {{{trafficConditions}}}

Alternative Routes: {{{alternativeRoutes}}}

Reason: Explain the reason for choosing the adjusted route.
Adjusted Route: Provide the adjusted route as serialized JSON string.

Output:
`,
});

const adjustRouteFlow = ai.defineFlow(
  {
    name: 'adjustRouteFlow',
    inputSchema: AdjustRouteInputSchema,
    outputSchema: AdjustRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
