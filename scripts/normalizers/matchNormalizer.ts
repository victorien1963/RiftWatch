import type { Match, MatchStatus, MatchTeam } from '../../src/shared/types';
import { createId } from '../../src/shared/utils/id';
import type {
  LolEsportsScheduleEvent,
  LolEsportsScheduleTeam,
  MatchSourceResult,
} from '../sources/matchSources';

const knownTeams: Record<string, MatchTeam> = {
  GEN: {
    id: 'team-geng',
    name: 'Gen.G',
    shortName: 'GEN',
    logoEmoji: '👑',
  },
  HLE: {
    id: 'team-hle',
    name: 'Hanwha Life Esports',
    shortName: 'HLE',
    logoEmoji: '🦅',
  },
  KT: {
    id: 'team-kt',
    name: 'KT Rolster',
    shortName: 'KT',
    logoEmoji: '⚡',
  },
  T1: {
    id: 'team-t1',
    name: 'T1',
    shortName: 'T1',
    logoEmoji: '⭐',
  },
};

const statusMap: Record<string, MatchStatus> = {
  completed: 'finished',
  inProgress: 'live',
  unstarted: 'upcoming',
};

const normalizeTeamCode = (team: LolEsportsScheduleTeam): string =>
  (team.code ?? team.name).trim().toUpperCase();

const toFallbackTeam = (team: LolEsportsScheduleTeam): MatchTeam => {
  const shortName = (team.code ?? team.name)
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 6)
    .toUpperCase();

  return {
    id: createId('team', team.code ?? team.name),
    name: team.name,
    shortName,
    logoEmoji: shortName.slice(0, 2),
  };
};

const toMatchTeam = (team: LolEsportsScheduleTeam): MatchTeam => {
  const knownTeam = knownTeams[normalizeTeamCode(team)];

  return knownTeam ?? toFallbackTeam(team);
};

const toBestOf = (value: number | undefined): 1 | 3 | 5 => {
  if (value === 5) {
    return 5;
  }

  if (value === 1) {
    return 1;
  }

  return 3;
};

const toStatus = (state: string): MatchStatus => statusMap[state] ?? 'upcoming';

const toTournament = (event: LolEsportsScheduleEvent): string =>
  event.blockName ? `${event.league.name} ${event.blockName}` : event.league.name;

const toHighlightUrl = (event: LolEsportsScheduleEvent, sourceUrl: string): string | undefined =>
  event.match.flags.includes('hasVod') ? `${sourceUrl.replace(/\/schedule$/, '')}/vod/${event.match.id}/1` : undefined;

const isNearCurrentDate = (scheduledAt: string, now: Date): boolean => {
  const scheduledTime = new Date(scheduledAt).getTime();
  const currentTime = now.getTime();
  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  const pastWindow = 60 * dayInMilliseconds;
  const futureWindow = 90 * dayInMilliseconds;

  return scheduledTime >= currentTime - pastWindow && scheduledTime <= currentTime + futureWindow;
};

const selectScheduleWindow = (events: LolEsportsScheduleEvent[], limit: number): LolEsportsScheduleEvent[] => {
  const now = new Date();
  const sortedEvents = [...events].sort(
    (eventA, eventB) => new Date(eventA.startTime).getTime() - new Date(eventB.startTime).getTime(),
  );
  const nearbyEvents = sortedEvents.filter((event) => isNearCurrentDate(event.startTime, now));

  if (nearbyEvents.length > 0) {
    return nearbyEvents.slice(0, limit);
  }

  return sortedEvents.slice(-limit);
};

const toMatch = (event: LolEsportsScheduleEvent, sourceUrl: string): Match => {
  const [teamA, teamB] = event.match.teams;
  const status = toStatus(event.state);
  const scoreA = teamA.result?.gameWins;
  const scoreB = teamB.result?.gameWins;

  return {
    id: createId('match', `${event.match.id}-${event.startTime}`),
    league: event.league.name,
    tournament: toTournament(event),
    scheduledAt: event.startTime,
    status,
    teamA: toMatchTeam(teamA),
    teamB: toMatchTeam(teamB),
    scoreA: status === 'upcoming' ? undefined : scoreA,
    scoreB: status === 'upcoming' ? undefined : scoreB,
    bestOf: toBestOf(event.match.strategy?.count),
    streamUrl: `${sourceUrl}?leagues=${event.league.slug}`,
    highlightUrl: toHighlightUrl(event, sourceUrl),
    note: event.blockName ? `${event.league.name} / ${event.blockName}` : event.league.name,
  };
};

export const normalizeLolEsportsMatches = (source: MatchSourceResult, limit = 80): Match[] =>
  selectScheduleWindow(source.events, limit).map((event) => toMatch(event, source.sourceUrl));
