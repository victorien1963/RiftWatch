export type RiotNewsCategory = {
  machineName: string;
  title: string;
};

export type RiotNewsAction = {
  payload?: {
    url?: string;
  };
};

export type RiotNewsArticle = {
  title: string;
  action?: RiotNewsAction;
  category?: RiotNewsCategory;
  description?: {
    body?: string;
  };
  publishedAt?: string;
};

type RiotNewsBlade = {
  type?: string;
  items?: unknown[];
};

type RiotNewsPage = {
  baseUrl?: string;
  blades?: RiotNewsBlade[];
};

type RiotNextData = {
  props?: {
    pageProps?: {
      page?: RiotNewsPage;
    };
  };
};

export type NewsSourceResult = {
  articles: RiotNewsArticle[];
  fetchedAt: string;
  sourceName: string;
  sourceUrl: string;
};

const officialLolNewsUrl = 'https://www.leagueoflegends.com/zh-tw/news/';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const toRiotNewsArticle = (value: unknown): RiotNewsArticle | null => {
  if (!isRecord(value) || !isString(value.title)) {
    return null;
  }

  const action = isRecord(value.action)
    ? {
        payload: isRecord(value.action.payload)
          ? {
              url: isString(value.action.payload.url) ? value.action.payload.url : undefined,
            }
          : undefined,
      }
    : undefined;
  const category = isRecord(value.category)
    ? {
        machineName: isString(value.category.machineName) ? value.category.machineName : 'other',
        title: isString(value.category.title) ? value.category.title : 'Other',
      }
    : undefined;
  const description = isRecord(value.description)
    ? {
        body: isString(value.description.body) ? value.description.body : undefined,
      }
    : undefined;

  return {
    title: value.title,
    action,
    category,
    description,
    publishedAt: isString(value.publishedAt) ? value.publishedAt : undefined,
  };
};

const extractNextDataJson = (html: string): string => {
  const nextDataMatch = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );

  if (!nextDataMatch?.[1]) {
    throw new Error('Official LoL news page did not include __NEXT_DATA__.');
  }

  return nextDataMatch[1];
};

const parseRiotNextData = (json: string): RiotNextData => JSON.parse(json) as RiotNextData;

const extractArticles = (nextData: RiotNextData): RiotNewsArticle[] => {
  const blades = nextData.props?.pageProps?.page?.blades ?? [];
  const articleGrid = blades.find((blade) => blade.type === 'articleCardGrid');
  const items = articleGrid?.items ?? [];

  return items
    .map((item) => toRiotNewsArticle(item))
    .filter((article): article is RiotNewsArticle => article !== null);
};

export const fetchOfficialLolNews = async (): Promise<NewsSourceResult> => {
  const response = await fetch(officialLolNewsUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch official LoL news: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const nextData = parseRiotNextData(extractNextDataJson(html));
  const articles = extractArticles(nextData);

  if (articles.length === 0) {
    throw new Error('Official LoL news page returned no article cards.');
  }

  return {
    articles,
    fetchedAt: new Date().toISOString(),
    sourceName: 'League of Legends 官方新聞',
    sourceUrl: officialLolNewsUrl,
  };
};
