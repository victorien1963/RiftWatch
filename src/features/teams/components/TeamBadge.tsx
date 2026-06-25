import type { Team } from '../types';
import styles from './TeamBadge.module.css';
import { TeamLogo } from './TeamLogo';

type TeamBadgeProps = {
  team: Pick<Team, 'id' | 'name' | 'shortName'>;
  size?: 'sm' | 'md';
};

export const TeamBadge = ({ team, size = 'md' }: TeamBadgeProps) => (
  <span
    className={`${styles.badge} ${styles[size]} ${team.id === 'team-tbd' ? styles.tbdBadge : ''}`}
    aria-label={team.shortName}
  >
    <TeamLogo team={team} size="sm" />
    <strong>{team.shortName}</strong>
  </span>
);
