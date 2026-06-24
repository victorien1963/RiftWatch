import { useMemo, useState } from 'react';
import BsBadge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { useMatchStore } from '../../shared/stores/matchStore';
import type { Match, MatchStatus } from '../../shared/types';
import { formatShortDate, formatTime } from '../../shared/utils/date';
import styles from './MatchesPage.module.css';

type StatusFilter = 'all' | MatchStatus;

const statusFilters: Array<{ key: StatusFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'upcoming', label: '未開賽' },
  { key: 'live', label: '進行中' },
  { key: 'finished', label: '已結束' },
];

const statusLabel: Record<MatchStatus, string> = {
  upcoming: 'upcoming',
  live: 'live',
  finished: 'finished',
};

const statusVariant: Record<MatchStatus, string> = {
  upcoming: 'primary',
  live: 'success',
  finished: 'secondary',
};

const sortByScheduledAtAsc = (items: Match[]): Match[] =>
  [...items].sort(
    (matchA, matchB) =>
      new Date(matchA.scheduledAt).getTime() - new Date(matchB.scheduledAt).getTime(),
  );

const matchesTeamKeyword = (match: Match, keyword: string): boolean => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return [
    match.teamA.name,
    match.teamA.shortName,
    match.teamB.name,
    match.teamB.shortName,
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedKeyword);
};

const formatScore = (match: Match): string => {
  if (match.scoreA === undefined || match.scoreB === undefined) {
    return 'vs';
  }

  return `${match.scoreA} : ${match.scoreB}`;
};

export const MatchesPage = () => {
  const matches = useMatchStore((state) => state.matches);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [teamKeyword, setTeamKeyword] = useState('');

  const filteredMatches = useMemo(
    () =>
      sortByScheduledAtAsc(
        matches.filter((match) => {
          const statusMatched = activeStatus === 'all' || match.status === activeStatus;
          return statusMatched && matchesTeamKeyword(match, teamKeyword);
        }),
      ),
    [activeStatus, matches, teamKeyword],
  );

  return (
    <section className={styles.page} aria-labelledby="matches-page-title">
      <SectionHeader icon="bi-calendar2-week" title="賽事篩選" titleId="matches-page-title" />

      <Card className={styles.filterCard}>
        <Card.Body className={styles.filterBody}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
            <Form.Control
              value={teamKeyword}
              placeholder="搜尋隊伍，例如 T1 / Gen.G / HLE"
              aria-label="搜尋隊伍"
              onChange={(event) => setTeamKeyword(event.currentTarget.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeStatus}
        className={styles.tabs}
        onSelect={(key) => setActiveStatus((key as StatusFilter | null) ?? 'all')}
      >
        {statusFilters.map((filter) => (
          <Tab eventKey={filter.key} key={filter.key} title={filter.label} />
        ))}
      </Tabs>

      <div className={styles.list}>
        {filteredMatches.map((match) => (
          <Card className={styles.matchCard} key={match.id}>
            <Card.Body className={styles.cardBody}>
              <div className={styles.topLine}>
                <div className={styles.metaGroup}>
                  <BsBadge bg="warning" text="dark">
                    {match.league}
                  </BsBadge>
                  <BsBadge bg={statusVariant[match.status]}>{statusLabel[match.status]}</BsBadge>
                  <span>BO{match.bestOf}</span>
                </div>
                <span>{formatShortDate(match.scheduledAt)}</span>
              </div>

              <div className={styles.matchup}>
                <div className={styles.team}>
                  <span aria-hidden="true">{match.teamA.logoEmoji}</span>
                  <strong>{match.teamA.shortName}</strong>
                </div>
                <div className={styles.score}>
                  <strong>{formatScore(match)}</strong>
                  <span>{formatTime(match.scheduledAt)}</span>
                </div>
                <div className={`${styles.team} ${styles.teamRight}`}>
                  <strong>{match.teamB.shortName}</strong>
                  <span aria-hidden="true">{match.teamB.logoEmoji}</span>
                </div>
              </div>

              <div className={styles.footer}>
                <span>{match.tournament}</span>
                {match.note ? <span>{match.note}</span> : null}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
};
