import { SectionHeader } from '../../../shared/components/SectionHeader';
import { TeamWatchList } from '../../teams/components/TeamWatchList';
import styles from './WatchSection.module.css';

export const WatchSection = () => (
  <section className={styles.section} aria-labelledby="watch-section-title">
    <SectionHeader icon="bi-bookmarks" title="隊伍觀測清單" titleId="watch-section-title" />
    <TeamWatchList />
  </section>
);
