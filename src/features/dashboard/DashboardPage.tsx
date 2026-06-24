import Button from 'react-bootstrap/Button';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { useToday } from '../../shared/hooks/useToday';
import { metaTrends } from '../../shared/mock/metaTrends';
import { useMatchStore } from '../../shared/stores/matchStore';
import { useNewsStore } from '../../shared/stores/newsStore';
import { usePatchStore } from '../../shared/stores/patchStore';
import { getRelativeDayLabel } from '../../shared/utils/date';
import { MatchSchedule } from '../matches/components/MatchSchedule';
import { NewsList } from '../news/components/NewsList';
import { PatchHighlights } from '../patches/components/PatchHighlights';
import { MetaTrendCard } from './components/MetaTrendCard';
import { TodayOverview } from './components/TodayOverview';
import { WatchSection } from './components/WatchSection';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const today = useToday();
  const news = useNewsStore((state) => state.news);
  const matches = useMatchStore((state) => state.matches);
  const patches = usePatchStore((state) => state.patches);
  const todaysMatches = matches.filter(
    (match) => getRelativeDayLabel(match.scheduledAt, today) === '今天',
  );

  return (
    <div className={styles.page}>
      <TodayOverview
        today={today}
        matches={todaysMatches}
        patches={patches}
        news={news}
        metaTrends={metaTrends}
      />

      <section className={styles.section} aria-labelledby="matches-title">
        <SectionHeader
          icon="bi-calendar2-week"
          title="今日賽事"
          titleId="matches-title"
          action={
            <Button className={styles.iconButton} variant="link" type="button" title="重新整理">
              <i className="bi bi-arrow-clockwise" aria-hidden="true" />
            </Button>
          }
        />
        <MatchSchedule matches={todaysMatches} />
      </section>

      <section className={styles.section} aria-labelledby="patch-title">
        <SectionHeader icon="bi-lightning-charge" title="版本重點" titleId="patch-title" />
        <PatchHighlights patches={patches} />
      </section>

      <section className={styles.section} aria-labelledby="meta-title">
        <SectionHeader icon="bi-graph-up-arrow" title="Meta 趨勢" titleId="meta-title" />
        <div className={styles.metaGrid}>
          {metaTrends.map((trend) => (
            <MetaTrendCard trend={trend} key={trend.id} />
          ))}
        </div>
      </section>

      <WatchSection />

      <section className={styles.section} aria-labelledby="news-title">
        <SectionHeader icon="bi-broadcast" title="重要新聞摘要" titleId="news-title" />
        <NewsList news={news} />
      </section>
    </div>
  );
};
