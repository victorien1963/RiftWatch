import { EmptyState } from '../../../shared/components/EmptyState';
import type { Match } from '../types';
import { MatchCard } from './MatchCard';
import styles from './MatchSchedule.module.css';

type MatchScheduleProps = {
  matches: Match[];
};

export const MatchSchedule = ({ matches }: MatchScheduleProps) => {
  if (matches.length === 0) {
    return (
      <EmptyState
        icon="bi-calendar2-x"
        title="今日沒有賽事"
        description="觀測站會在賽程更新後顯示重點場次。"
      />
    );
  }

  return (
    <div className={styles.schedule}>
      {matches.map((match) => (
        <MatchCard match={match} key={match.id} />
      ))}
    </div>
  );
};
