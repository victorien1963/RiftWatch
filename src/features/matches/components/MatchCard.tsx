import Card from 'react-bootstrap/Card';
import { Badge } from '../../../shared/components/Badge';
import { formatTime } from '../../../shared/utils/date';
import { TeamLogo } from '../../teams/components/TeamLogo';
import type { Match } from '../types';
import styles from './MatchCard.module.css';

type MatchCardProps = {
  match: Match;
};

const statusLabel: Record<Match['status'], string> = {
  live: '進行中',
  upcoming: '未開賽',
  finished: '已結束',
};

const statusTone: Record<Match['status'], 'green' | 'blue' | 'muted'> = {
  live: 'green',
  upcoming: 'blue',
  finished: 'muted',
};

export const MatchCard = ({ match }: MatchCardProps) => (
  <Card className={styles.card}>
    <Card.Body className={styles.body}>
      <div className={styles.topLine}>
        <div className={styles.league}>
          <Badge tone="gold">{match.league}</Badge>
          <span>BO{match.bestOf}</span>
          <span>{match.tournament}</span>
        </div>
        <Badge tone={statusTone[match.status]}>{statusLabel[match.status]}</Badge>
      </div>

      <div className={styles.matchup}>
        <div className={styles.team}>
          <TeamLogo team={match.teamA} size="sm" />
          <strong className={match.teamA.id === 'team-tbd' ? styles.tbdTeam : ''}>
            {match.teamA.shortName}
          </strong>
        </div>
        <div className={styles.time}>
          <i className="bi bi-clock" aria-hidden="true" />
          {match.scoreA !== undefined && match.scoreB !== undefined
            ? `${match.scoreA} : ${match.scoreB}`
            : formatTime(match.scheduledAt)}
        </div>
        <div className={`${styles.team} ${styles.right}`}>
          <strong className={match.teamB.id === 'team-tbd' ? styles.tbdTeam : ''}>
            {match.teamB.shortName}
          </strong>
          <TeamLogo team={match.teamB} size="sm" />
        </div>
      </div>

      {match.note ? <p>{match.note}</p> : null}
    </Card.Body>
  </Card>
);
