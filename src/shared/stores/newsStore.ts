import { create } from 'zustand';
import { getInitialNews } from '../services/newsService';
import type { NewsCategory, NewsItem } from '../types';

type NewsState = {
  news: NewsItem[];
  getLatestNews: (limit?: number) => NewsItem[];
  getImportantNews: () => NewsItem[];
  filterNewsByCategory: (category: NewsCategory) => NewsItem[];
  searchNews: (query: string) => NewsItem[];
};

const sortByPublishedAtDesc = (items: NewsItem[]): NewsItem[] =>
  [...items].sort(
    (itemA, itemB) =>
      new Date(itemB.publishedAt).getTime() - new Date(itemA.publishedAt).getTime(),
  );

const searchableText = (item: NewsItem): string =>
  [item.title, item.summary, ...item.tags].join(' ').toLowerCase();

export const useNewsStore = create<NewsState>()((_set, get) => ({
  news: getInitialNews(),
  getLatestNews: (limit) => {
    const sortedNews = sortByPublishedAtDesc(get().news);
    return typeof limit === 'number' ? sortedNews.slice(0, limit) : sortedNews;
  },
  getImportantNews: () =>
    sortByPublishedAtDesc(get().news.filter((item) => item.importance === 'high')),
  filterNewsByCategory: (category) =>
    sortByPublishedAtDesc(get().news.filter((item) => item.category === category)),
  searchNews: (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return sortByPublishedAtDesc(get().news);
    }

    return sortByPublishedAtDesc(
      get().news.filter((item) => searchableText(item).includes(normalizedQuery)),
    );
  },
}));
