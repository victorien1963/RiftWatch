import type { Team } from '../../../shared/types';
import styles from './TeamLogo.module.css';

type TeamLogoProps = {
  team: Pick<Team, 'id' | 'name' | 'shortName'>;
  size?: 'sm' | 'md';
};

const teamLogoById: Record<string, string> = {
  'team-bfx': '/team-logos/team-bfx.png',
  'team-bro': '/team-logos/team-bro.png',
  'team-dcg': '/team-logos/team-dcg.png',
  'team-dk': '/team-logos/team-dk.png',
  'team-dns': '/team-logos/team-dns.webp',
  'team-geng': '/team-logos/team-geng.png',
  'team-hle': '/team-logos/team-hle.png',
  'team-kc': '/team-logos/team-kc.png',
  'team-krx': '/team-logos/team-krx.png',
  'team-kt': '/team-logos/team-kt.png',
  'team-ns': '/team-logos/team-ns.png',
  'team-t1': '/team-logos/team-t1.png',
  'team-tlaw': '/team-logos/team-tlaw.png',
};

export const TeamLogo = ({ team, size = 'md' }: TeamLogoProps) => {
  const logoUrl = teamLogoById[team.id];

  if (!logoUrl) {
    return null;
  }

  return (
    <span className={`${styles.logo} ${styles[size]}`}>
      <img alt={`${team.name} logo`} loading="lazy" src={logoUrl} />
    </span>
  );
};
