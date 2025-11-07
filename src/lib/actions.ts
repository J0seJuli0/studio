'use server';

import {
  adjustRoute,
  type AdjustRouteInput,
} from '@/ai/flows/real-time-route-adjustment';
import {
  optimizeRouteBasedOnFactors,
  type OptimizeRouteBasedOnFactorsInput,
} from '@/ai/flows/optimize-route-factors';

export async function optimizeRouteAction(
  input: OptimizeRouteBasedOnFactorsInput
) {
  try {
    const result = await optimizeRouteBasedOnFactors(input);
    if (!result || !result.optimizedRoute || !result.reasoning) {
      throw new Error('AI failed to generate a valid route.');
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error optimizing route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function adjustRouteAction(input: AdjustRouteInput) {
  try {
    const result = await adjustRoute(input);
    if (!result || !result.adjustedRoute || !result.reason) {
      throw new Error('AI failed to generate a valid adjustment.');
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error adjusting route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
