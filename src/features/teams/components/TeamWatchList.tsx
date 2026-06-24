import Button from 'react-bootstrap/Button';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Badge } from '../../../shared/components/Badge';
import { useWatchStore } from '../../../shared/stores/watchStore';
import { TeamBadge } from './TeamBadge';
import styles from './TeamWatchList.module.css';

export const TeamWatchList = () => {
  const teams = useWatchStore((state) => state.teams);
  const toggleWatchedTeam = useWatchStore((state) => state.toggleWatchedTeam);
  const getWatchedTeams = useWatchStore((state) => state.getWatchedTeams);
  const watchedTeams = getWatchedTeams();
  const suggestedTeams = teams.filter((team) => !team.watched);

  return (
    <div className={styles.list}>
      {watchedTeams.length === 0 ? (
        <EmptyState
          icon="bi-bookmark"
          title="尚未追蹤隊伍"
          description="點選下方隊伍即可加入觀測清單。"
        />
      ) : (
        watchedTeams.map((team) => (
          <article className={styles.teamRow} key={team.id}>
            <TeamBadge team={team} />
            <div className={styles.teamMain}>
              <div className={styles.teamTitle}>
                <strong>{team.name}</strong>
                <Badge tone="blue">{team.region}</Badge>
                <Badge tone={team.watched ? 'gold' : 'muted'}>
                  {team.watched ? '預設追蹤' : '可加入'}
                </Badge>
              </div>
              <p>
                {team.shortName} 目前列在 LCK 觀測池，後續可接 API 回填近期戰績、選手與賽程。
              </p>
              <div className={styles.metaLine}>
                <span>{team.logoEmoji}</span>
                <span>{team.shortName}</span>
              </div>
            </div>
            <Button
              className={styles.iconButton}
              variant="link"
              type="button"
              aria-label={`取消追蹤 ${team.name}`}
              title="取消追蹤"
              onClick={() => toggleWatchedTeam(team.id)}
            >
              <i className="bi bi-bookmark-fill" aria-hidden="true" />
            </Button>
          </article>
        ))
      )}

      {suggestedTeams.length > 0 ? (
        <div className={styles.suggestions}>
          {suggestedTeams.map((team) => (
            <Button
              className={styles.suggestionButton}
              variant="outline-light"
              type="button"
              key={team.id}
              onClick={() => toggleWatchedTeam(team.id)}
            >
              <TeamBadge team={team} size="sm" />
              <span>{team.shortName}</span>
              <i className="bi bi-plus-lg" aria-hidden="true" />
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
