import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getInitialMatches } from '../services/matchService';
import type { Match } from '../types';

type MatchState = {
  matches: Match[];
  getUpcomingMatches: () => Match[];
  getLiveMatches: () => Match[];
  getFinishedMatches: () => Match[];
  getMatchesByTeam: (teamId: string) => Match[];
};

const sortByScheduledAtAsc = (items: Match[]): Match[] =>
  [...items].sort(
    (matchA, matchB) =>
      new Date(matchA.scheduledAt).getTime() - new Date(matchB.scheduledAt).getTime(),
  );

export const useMatchStore = create<MatchState>()(
  persist(
    (_set, get) => ({
      matches: getInitialMatches(),
      getUpcomingMatches: () =>
        sortByScheduledAtAsc(get().matches.filter((match) => match.status === 'upcoming')),
      getLiveMatches: () =>
        sortByScheduledAtAsc(get().matches.filter((match) => match.status === 'live')),
      getFinishedMatches: () =>
        sortByScheduledAtAsc(get().matches.filter((match) => match.status === 'finished')),
      getMatchesByTeam: (teamId) =>
        sortByScheduledAtAsc(
          get().matches.filter(
            (match) => match.teamA.id === teamId || match.teamB.id === teamId,
          ),
        ),
    }),
    {
      name: 'rift-watch-matches',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
