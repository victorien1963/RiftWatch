import generatedTeams from '../generated/teams.json';
import type { Team } from '../types';

const cloneTeams = (items: Team[]): Team[] => items.map((team) => ({ ...team }));

export const getInitialTeams = (): Team[] => cloneTeams(generatedTeams as Team[]);

export const fetchTeams = async (): Promise<Team[]> => getInitialTeams();
