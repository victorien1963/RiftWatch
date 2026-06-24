import generatedPatches from '../generated/patches.json';
import type { PatchNote } from '../types';

const clonePatches = (items: PatchNote[]): PatchNote[] =>
  items.map((patch) => ({
    ...patch,
    championChanges: patch.championChanges.map((change) => ({ ...change })),
    itemChanges: patch.itemChanges.map((change) => ({ ...change })),
    systemChanges: patch.systemChanges.map((change) => ({ ...change })),
  }));

export const getInitialPatches = (): PatchNote[] => clonePatches(generatedPatches as PatchNote[]);

export const fetchPatches = async (): Promise<PatchNote[]> => getInitialPatches();
