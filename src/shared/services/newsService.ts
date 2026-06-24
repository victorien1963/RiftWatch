import generatedNews from '../generated/news.json';
import type { NewsItem } from '../types';

const cloneNews = (items: NewsItem[]): NewsItem[] =>
  items.map((item) => ({
    ...item,
    tags: [...item.tags],
    relatedTeams: item.relatedTeams ? [...item.relatedTeams] : undefined,
    relatedPlayers: item.relatedPlayers ? [...item.relatedPlayers] : undefined,
  }));

export const getInitialNews = (): NewsItem[] => cloneNews(generatedNews as NewsItem[]);

export const fetchNews = async (): Promise<NewsItem[]> => getInitialNews();
