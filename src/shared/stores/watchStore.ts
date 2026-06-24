import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { teams as mockTeams } from '../mock/teams';
import type { Team } from '../types';

type WatchState = {
  teams: Team[];
  toggleWatchedTeam: (teamId: string) => void;
  getWatchedTeams: () => Team[];
};

export const useWatchStore = create<WatchState>()(
  persist(
    (set, get) => ({
      teams: mockTeams,
      toggleWatchedTeam: (teamId) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, watched: !team.watched } : team,
          ),
        }));
      },
      getWatchedTeams: () => get().teams.filter((team) => team.watched),
    }),
    {
      name: 'rift-watch-preferences',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
