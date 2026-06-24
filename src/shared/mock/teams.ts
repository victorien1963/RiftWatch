import type { Team } from '../types';

export const teams: Team[] = [
  {
    id: 'team-t1',
    name: 'T1',
    region: 'LCK',
    shortName: 'T1',
    logoEmoji: '⭐',
    watched: true,
  },
  {
    id: 'team-geng',
    name: 'Gen.G',
    region: 'LCK',
    shortName: 'GEN',
    logoEmoji: '👑',
    watched: true,
  },
  {
    id: 'team-hle',
    name: 'Hanwha Life Esports',
    region: 'LCK',
    shortName: 'HLE',
    logoEmoji: '🦅',
    watched: false,
  },
  {
    id: 'team-kt',
    name: 'KT Rolster',
    region: 'LCK',
    shortName: 'KT',
    logoEmoji: '⚡',
    watched: false,
  },
];
