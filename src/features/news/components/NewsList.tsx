import { EmptyState } from '../../../shared/components/EmptyState';
import type { NewsItem } from '../types';
import { NewsCard } from './NewsCard';
import styles from './NewsList.module.css';

type NewsListProps = {
  news: NewsItem[];
};

export const NewsList = ({ news }: NewsListProps) => {
  if (news.length === 0) {
    return (
      <EmptyState icon="bi-newspaper" title="暫無新聞" description="觀測站目前沒有新的摘要。" />
    );
  }

  return (
    <div className={styles.list}>
      {news.map((item) => (
        <NewsCard item={item} key={item.id} />
      ))}
    </div>
  );
};
