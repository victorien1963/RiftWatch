import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { Badge } from '../../../shared/components/Badge';
import { formatShortDate } from '../../../shared/utils/date';
import type { NewsItem } from '../types';
import styles from './NewsCard.module.css';

type NewsCardProps = {
  item: NewsItem;
};

const categoryLabel: Record<NewsItem['category'], string> = {
  esports: '賽事',
  patch: '版本',
  roster: '陣容',
  interview: '訪談',
  rumor: '傳聞',
  other: '其他',
};

const importanceTone: Record<NewsItem['importance'], 'muted' | 'blue' | 'gold'> = {
  low: 'muted',
  medium: 'blue',
  high: 'gold',
};

export const NewsCard = ({ item }: NewsCardProps) => (
  <a
    aria-label={`開啟新聞：${item.title}`}
    className={styles.cardLink}
    href={item.sourceUrl}
    rel="noreferrer"
    target="_blank"
  >
    <Card className={styles.card}>
      <Card.Body className={styles.body}>
        <div className={styles.meta}>
          <Badge tone={item.category === 'roster' || item.category === 'rumor' ? 'gold' : 'blue'}>
            {categoryLabel[item.category]}
          </Badge>
          <Badge tone={importanceTone[item.importance]}>{item.importance}</Badge>
          <span>{item.sourceName}</span>
          <span>{formatShortDate(item.publishedAt)}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <Stack direction="horizontal" gap={2} className={styles.tags}>
          {item.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  </a>
);
