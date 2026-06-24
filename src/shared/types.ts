export type Importance = 'low' | 'medium' | 'high';

export type Role = 'top' | 'jungle' | 'mid' | 'bot' | 'support';

export type NewsCategory = 'esports' | 'patch' | 'roster' | 'interview' | 'rumor' | 'other';

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  category: NewsCategory;
  tags: string[];
  relatedTeams?: string[];
  relatedPlayers?: string[];
  importance: Importance;
};

export type TeamRegion = 'LCK' | 'LPL' | 'LEC' | 'LTA' | 'PCS' | 'Other';

export type Team = {
  id: string;
  name: string;
  region: TeamRegion;
  shortName: string;
  logoEmoji: string;
  watched: boolean;
};

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type MatchTeam = Pick<Team, 'id' | 'name' | 'shortName' | 'logoEmoji'>;

export type Match = {
  id: string;
  league: string;
  tournament: string;
  scheduledAt: string;
  status: MatchStatus;
  teamA: MatchTeam;
  teamB: MatchTeam;
  scoreA?: number;
  scoreB?: number;
  bestOf: 1 | 3 | 5;
  streamUrl?: string;
  highlightUrl?: string;
  note?: string;
};

export type ChampionChangeType = 'buff' | 'nerf' | 'adjust' | 'rework';

export type ChampionChange = {
  championName: string;
  changeType: ChampionChangeType;
  summary: string;
  role?: Role;
};

export type ItemChange = {
  itemName: string;
  changeType: ChampionChangeType;
  summary: string;
};

export type SystemChange = {
  systemName: string;
  summary: string;
};

export type PatchNote = {
  id: string;
  version: string;
  releasedAt: string;
  title: string;
  summary: string;
  championChanges: ChampionChange[];
  itemChanges: ItemChange[];
  systemChanges: SystemChange[];
  sourceUrl: string;
  impactLevel: Importance;
};

export type MetaTrend = {
  id: string;
  label: string;
  role: Role;
  trend: 'rising' | 'stable' | 'falling';
  value: number;
  note: string;
};
