import Card from 'react-bootstrap/Card';
import { formatShortDate } from '../../../shared/utils/date';
import type { Match, MetaTrend, NewsItem, PatchNote } from '../../../shared/types';
import styles from './TodayOverview.module.css';

type TodayOverviewProps = {
  today: Date;
  matches: Match[];
  patches: PatchNote[];
  news: NewsItem[];
  metaTrends: MetaTrend[];
};

export const TodayOverview = ({
  today,
  matches,
  patches,
  news,
  metaTrends,
}: TodayOverviewProps) => {
  const topTrend = metaTrends[0];
  const latestPatch = patches[0];

  return (
    <section className={styles.hero} aria-labelledby="today-overview-title">
      <div className={styles.copy}>
        <p className={styles.date}>{formatShortDate(today.toISOString())}</p>
        <h2 id="today-overview-title">今日峽谷觀測</h2>
        <p>快速掃描賽事、版本、隊伍動態與 Meta 走向。</p>
      </div>

      <div className={styles.grid}>
        <Card className={styles.statCard}>
          <Card.Body>
            <i className="bi bi-calendar-event" aria-hidden="true" />
            <strong>{matches.length}</strong>
            <span>今日賽事</span>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <i className="bi bi-sliders2" aria-hidden="true" />
            <strong>{latestPatch?.version ?? '-'}</strong>
            <span>版本重點</span>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <i className="bi bi-activity" aria-hidden="true" />
            <strong>{topTrend?.value ?? 0}</strong>
            <span>Meta 熱度</span>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <i className="bi bi-newspaper" aria-hidden="true" />
            <strong>{news.length}</strong>
            <span>重要摘要</span>
          </Card.Body>
        </Card>
      </div>
    </section>
  );
};
