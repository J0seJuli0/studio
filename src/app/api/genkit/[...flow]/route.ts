'use server';
import { run } from '@genkit-ai/next';
import '@/ai/flows/real-time-route-adjustment';
import '@/ai/flows/optimize-route-factors';

export const POST = run;
