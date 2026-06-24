export type LolEsportsLeague = {
  id: string;
  name: string;
  slug: string;
};

export type LolEsportsTeamResult = {
  outcome?: string;
  gameWins?: number;
};

export type LolEsportsScheduleTeam = {
  name: string;
  code?: string;
  result?: LolEsportsTeamResult;
};

export type LolEsportsMatchStrategy = {
  type?: string;
  count?: number;
};

export type LolEsportsScheduleEvent = {
  startTime: string;
  state: string;
  type: string;
  blockName?: string;
  league: {
    name: string;
    slug: string;
  };
  match: {
    id: string;
    flags: string[];
    teams: LolEsportsScheduleTeam[];
    strategy?: LolEsportsMatchStrategy;
  };
};

export type MatchSourceResult = {
  events: LolEsportsScheduleEvent[];
  fetchedAt: string;
  sourceName: string;
  sourceUrl: string;
};

type LolEsportsLeaguesResponse = {
  data?: {
    leagues?: unknown[];
  };
};

type LolEsportsScheduleResponse = {
  data?: {
    schedule?: {
      events?: unknown[];
    };
  };
};

const lolEsportsApiBaseUrl = 'https://esports-api.lolesports.com/persisted/gw';
const lolEsportsWebBaseUrl = 'https://lolesports.com';
const lolEsportsApiKey = '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z';
const locale = 'zh-TW';
const defaultLeagueSlugs = ['lck', 'msi', 'worlds'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const fetchLolEsportsJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${lolEsportsApiBaseUrl}${path}`, {
    headers: {
      'x-api-key': lolEsportsApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`LoL Esports request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
};

const toLeague = (value: unknown): LolEsportsLeague | null => {
  if (!isRecord(value) || !isString(value.id) || !isString(value.name) || !isString(value.slug)) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    slug: value.slug,
  };
};

const toTeam = (value: unknown): LolEsportsScheduleTeam | null => {
  if (!isRecord(value) || !isString(value.name)) {
    return null;
  }

  const result = isRecord(value.result)
    ? {
        outcome: isString(value.result.outcome) ? value.result.outcome : undefined,
        gameWins: isNumber(value.result.gameWins) ? value.result.gameWins : undefined,
      }
    : undefined;

  return {
    name: value.name,
    code: isString(value.code) ? value.code : undefined,
    result,
  };
};

const toScheduleEvent = (value: unknown): LolEsportsScheduleEvent | null => {
  if (
    !isRecord(value) ||
    !isString(value.startTime) ||
    !isString(value.state) ||
    !isString(value.type) ||
    !isRecord(value.league) ||
    !isString(value.league.name) ||
    !isString(value.league.slug) ||
    !isRecord(value.match) ||
    !isString(value.match.id) ||
    !Array.isArray(value.match.teams)
  ) {
    return null;
  }

  const teams = value.match.teams
    .map((team) => toTeam(team))
    .filter((team): team is LolEsportsScheduleTeam => team !== null);

  if (teams.length < 2) {
    return null;
  }

  const flags = Array.isArray(value.match.flags)
    ? value.match.flags.filter((flag): flag is string => isString(flag))
    : [];
  const strategy = isRecord(value.match.strategy)
    ? {
        type: isString(value.match.strategy.type) ? value.match.strategy.type : undefined,
        count: isNumber(value.match.strategy.count) ? value.match.strategy.count : undefined,
      }
    : undefined;

  return {
    startTime: value.startTime,
    state: value.state,
    type: value.type,
    blockName: isString(value.blockName) ? value.blockName : undefined,
    league: {
      name: value.league.name,
      slug: value.league.slug,
    },
    match: {
      id: value.match.id,
      flags,
      teams,
      strategy,
    },
  };
};

const fetchLeagues = async (): Promise<LolEsportsLeague[]> => {
  const response = await fetchLolEsportsJson<LolEsportsLeaguesResponse>(
    `/getLeagues?hl=${locale}`,
  );
  const leagues = response.data?.leagues ?? [];

  return leagues
    .map((league) => toLeague(league))
    .filter((league): league is LolEsportsLeague => league !== null);
};

const fetchScheduleByLeague = async (league: LolEsportsLeague): Promise<LolEsportsScheduleEvent[]> => {
  const response = await fetchLolEsportsJson<LolEsportsScheduleResponse>(
    `/getSchedule?hl=${locale}&leagueId=${league.id}`,
  );
  const events = response.data?.schedule?.events ?? [];

  return events
    .map((event) => toScheduleEvent(event))
    .filter((event): event is LolEsportsScheduleEvent => event !== null);
};

export const fetchLolEsportsSchedule = async (
  leagueSlugs = defaultLeagueSlugs,
): Promise<MatchSourceResult> => {
  const leagues = await fetchLeagues();
  const selectedLeagues = leagues.filter((league) => leagueSlugs.includes(league.slug));

  if (selectedLeagues.length === 0) {
    throw new Error(`LoL Esports returned no matching leagues: ${leagueSlugs.join(', ')}`);
  }

  const scheduleGroups = await Promise.all(selectedLeagues.map((league) => fetchScheduleByLeague(league)));
  const events = scheduleGroups.flat().filter((event) => event.type === 'match');

  if (events.length === 0) {
    throw new Error('LoL Esports schedule returned no match events.');
  }

  return {
    events,
    fetchedAt: new Date().toISOString(),
    sourceName: 'LoL Esports schedule',
    sourceUrl: `${lolEsportsWebBaseUrl}/schedule`,
  };
};
