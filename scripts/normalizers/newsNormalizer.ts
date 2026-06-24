import type { NewsCategory, NewsItem } from '../../src/shared/types';
import { createId } from '../../src/shared/utils/id';
import type { NewsSourceResult, RiotNewsArticle } from '../sources/newsSources';

const teamKeywords = [
  { id: 'team-t1', keywords: ['T1', 'Faker', 'Keria', 'Oner'] },
  { id: 'team-geng', keywords: ['Gen.G', 'GEN', 'Chovy'] },
  { id: 'team-hle', keywords: ['HLE', 'Hanwha'] },
  { id: 'team-kt', keywords: ['KT', 'Rolster'] },
];

const playerKeywords = ['Faker', 'Keria', 'Chovy', 'Oner'];

const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toAbsoluteUrl = (url: string | undefined, sourceUrl: string): string => {
  if (!url) {
    return sourceUrl;
  }

  return new URL(url, sourceUrl).toString();
};

const mapCategory = (article: RiotNewsArticle): NewsCategory => {
  const machineName = article.category?.machineName ?? '';
  const title = article.title.toLowerCase();

  if (machineName === 'esports') {
    return 'esports';
  }

  if (machineName === 'game-updates' || title.includes('patch')) {
    return 'patch';
  }

  if (title.includes('interview') || title.includes('訪談')) {
    return 'interview';
  }

  return 'other';
};

const inferTags = (article: RiotNewsArticle, category: NewsCategory): string[] => {
  const tags = new Set<string>([article.category?.title ?? category]);
  const content = `${article.title} ${article.description?.body ?? ''}`;

  teamKeywords.forEach((team) => {
    if (team.keywords.some((keyword) => content.includes(keyword))) {
      tags.add(team.id.replace('team-', '').toUpperCase());
    }
  });

  playerKeywords.forEach((player) => {
    if (content.includes(player)) {
      tags.add(player);
    }
  });

  if (category === 'patch') {
    tags.add('Patch');
  }

  return Array.from(tags);
};

const inferRelatedTeams = (article: RiotNewsArticle): string[] | undefined => {
  const content = `${article.title} ${article.description?.body ?? ''}`;
  const relatedTeams = teamKeywords
    .filter((team) => team.keywords.some((keyword) => content.includes(keyword)))
    .map((team) => team.id);

  return relatedTeams.length > 0 ? relatedTeams : undefined;
};

const inferRelatedPlayers = (article: RiotNewsArticle): string[] | undefined => {
  const content = `${article.title} ${article.description?.body ?? ''}`;
  const relatedPlayers = playerKeywords.filter((player) => content.includes(player));

  return relatedPlayers.length > 0 ? relatedPlayers : undefined;
};

export const normalizeOfficialLolNews = (source: NewsSourceResult, limit = 24): NewsItem[] =>
  source.articles.slice(0, limit).map((article) => {
    const category = mapCategory(article);
    const summary = stripHtml(article.description?.body ?? '官方新聞摘要待補。');

    return {
      id: createId('news', `${source.sourceName}-${article.title}-${article.publishedAt ?? ''}`),
      title: article.title,
      summary,
      sourceName: source.sourceName,
      sourceUrl: toAbsoluteUrl(article.action?.payload?.url, source.sourceUrl),
      publishedAt: article.publishedAt ?? source.fetchedAt,
      category,
      tags: inferTags(article, category),
      relatedTeams: inferRelatedTeams(article),
      relatedPlayers: inferRelatedPlayers(article),
      importance: category === 'patch' || category === 'esports' ? 'high' : 'medium',
    };
  });
