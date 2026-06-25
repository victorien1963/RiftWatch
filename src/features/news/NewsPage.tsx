import { useMemo, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { useNewsStore } from '../../shared/stores/newsStore';
import type { NewsCategory, NewsItem } from '../../shared/types';
import { NewsCard } from './components/NewsCard';
import styles from './NewsPage.module.css';

type CategoryFilter = 'all' | NewsCategory;

const categoryFilters: Array<{ key: CategoryFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'esports', label: '賽事' },
  { key: 'patch', label: '版本' },
  { key: 'roster', label: '陣容' },
  { key: 'interview', label: '訪談' },
  { key: 'rumor', label: '傳聞' },
  { key: 'other', label: '其他' },
];

const sortByPublishedAtDesc = (items: NewsItem[]): NewsItem[] =>
  [...items].sort(
    (itemA, itemB) =>
      new Date(itemB.publishedAt).getTime() - new Date(itemA.publishedAt).getTime(),
  );

const matchesKeyword = (item: NewsItem, keyword: string): boolean => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return [item.title, item.summary, ...item.tags]
    .join(' ')
    .toLowerCase()
    .includes(normalizedKeyword);
};

export const NewsPage = () => {
  const news = useNewsStore((state) => state.news);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [highOnly, setHighOnly] = useState(false);

  const filteredNews = useMemo(
    () =>
      sortByPublishedAtDesc(
        news.filter((item) => {
          const categoryMatched = activeCategory === 'all' || item.category === activeCategory;
          const importanceMatched = !highOnly || item.importance === 'high';
          return categoryMatched && importanceMatched && matchesKeyword(item, keyword);
        }),
      ),
    [activeCategory, highOnly, keyword, news],
  );

  return (
    <section className={styles.page} aria-labelledby="news-page-title">
      <SectionHeader icon="bi-newspaper" title="情報搜尋" titleId="news-page-title" />

      <Card className={styles.filterCard}>
        <Card.Body className={styles.filterBody}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
            <Form.Control
              value={keyword}
              placeholder="搜尋 title / summary / tags"
              aria-label="搜尋新聞"
              onChange={(event) => setKeyword(event.currentTarget.value)}
            />
          </InputGroup>
          <Form.Check
            checked={highOnly}
            id="high-importance-only"
            label="只顯示 high importance"
            type="switch"
            onChange={(event) => setHighOnly(event.currentTarget.checked)}
          />
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeCategory}
        className={styles.tabs}
        onSelect={(key) => setActiveCategory((key as CategoryFilter | null) ?? 'all')}
      >
        {categoryFilters.map((filter) => (
          <Tab eventKey={filter.key} key={filter.key} title={filter.label} />
        ))}
      </Tabs>

      <div className={styles.list}>
        {filteredNews.map((item) => (
          <NewsCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
};
