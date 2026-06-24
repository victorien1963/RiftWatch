import type { Team } from '../types';
import styles from './TeamBadge.module.css';

type TeamBadgeProps = {
  team: Pick<Team, 'shortName' | 'logoEmoji'>;
  size?: 'sm' | 'md';
};

export const TeamBadge = ({ team, size = 'md' }: TeamBadgeProps) => (
  <span className={`${styles.badge} ${styles[size]}`} aria-label={team.shortName}>
    <span aria-hidden="true">{team.logoEmoji}</span>
    <strong>{team.shortName}</strong>
  </span>
);
