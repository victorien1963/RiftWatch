import generatedMatches from '../generated/matches.json';
import type { Match } from '../types';

const cloneMatches = (items: Match[]): Match[] =>
  items.map((match) => ({
    ...match,
    teamA: { ...match.teamA },
    teamB: { ...match.teamB },
  }));

export const getInitialMatches = (): Match[] => cloneMatches(generatedMatches as Match[]);

export const fetchMatches = async (): Promise<Match[]> => getInitialMatches();
