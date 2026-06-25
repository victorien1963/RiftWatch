import { create } from 'zustand';
import { getInitialPatches } from '../services/patchService';
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

export const usePatchStore = create<PatchState>()((_set, get) => ({
  patches: getInitialPatches(),
  getLatestPatch: () => sortByReleasedAtDesc(get().patches)[0],
  getHighImpactChanges: () =>
    sortByReleasedAtDesc(get().patches.filter((patch) => patch.impactLevel === 'high')),
}));
