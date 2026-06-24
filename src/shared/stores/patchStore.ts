import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { patches as mockPatches } from '../mock/patches';
import type { PatchNote } from '../types';

type PatchState = {
  patches: PatchNote[];
  getLatestPatch: () => PatchNote | undefined;
  getHighImpactChanges: () => PatchNote[];
};

const sortByReleasedAtDesc = (items: PatchNote[]): PatchNote[] =>
  [...items].sort(
    (patchA, patchB) =>
      new Date(patchB.releasedAt).getTime() - new Date(patchA.releasedAt).getTime(),
  );

export const usePatchStore = create<PatchState>()(
  persist(
    (_set, get) => ({
      patches: mockPatches,
      getLatestPatch: () => sortByReleasedAtDesc(get().patches)[0],
      getHighImpactChanges: () =>
        sortByReleasedAtDesc(get().patches.filter((patch) => patch.impactLevel === 'high')),
    }),
    {
      name: 'rift-watch-patches',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
