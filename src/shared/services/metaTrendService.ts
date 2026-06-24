import generatedMetaTrends from '../generated/metaTrends.json';
import type { MetaTrend } from '../types';

const cloneMetaTrends = (items: MetaTrend[]): MetaTrend[] =>
  items.map((trend) => ({ ...trend }));

export const getInitialMetaTrends = (): MetaTrend[] =>
  cloneMetaTrends(generatedMetaTrends as MetaTrend[]);

export const fetchMetaTrends = async (): Promise<MetaTrend[]> => getInitialMetaTrends();
