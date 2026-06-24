import type { Match } from '../types';
import { createId } from '../utils/id';
import { teams } from './teams';

const getMatchTeam = (teamId: string): Match['teamA'] => {
  const team = teams.find((entry) => entry.id === teamId);

  if (!team) {
    throw new Error(`Missing mock team: ${teamId}`);
  }

  return {
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    logoEmoji: team.logoEmoji,
  };
};

export const matches: Match[] = [
  {
    id: createId('match', 't1 geng 2026 06 24'),
    league: 'LCK',
    tournament: 'LCK Summer 2026',
    scheduledAt: '2026-06-24T17:00:00+08:00',
    status: 'upcoming',
    bestOf: 3,
    teamA: getMatchTeam('team-t1'),
    teamB: getMatchTeam('team-geng'),
    streamUrl: 'https://example.com/streams/lck-t1-geng',
    note: '榜首節奏對決，重點看前兩條小龍與中野支援速度。',
  },
  {
    id: createId('match', 'hle kt 2026 06 24'),
    league: 'LCK',
    tournament: 'LCK Summer 2026',
    scheduledAt: '2026-06-24T19:00:00+08:00',
    status: 'live',
    bestOf: 3,
    teamA: getMatchTeam('team-hle'),
    teamB: getMatchTeam('team-kt'),
    scoreA: 1,
    scoreB: 1,
    streamUrl: 'https://example.com/streams/lck-hle-kt',
    note: '第三局 BP 可能圍繞上路邊線與第一條峽谷先鋒展開。',
  },
  {
    id: createId('match', 'geng hle 2026 06 23'),
    league: 'LCK',
    tournament: 'LCK Summer 2026',
    scheduledAt: '2026-06-23T19:00:00+08:00',
    status: 'finished',
    bestOf: 3,
    teamA: getMatchTeam('team-geng'),
    teamB: getMatchTeam('team-hle'),
    scoreA: 2,
    scoreB: 1,
    highlightUrl: 'https://example.com/highlights/lck-geng-hle',
    note: 'Gen.G 靠中期物件交換拿下系列賽。',
  },
];
