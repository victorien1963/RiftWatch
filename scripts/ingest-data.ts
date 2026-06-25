import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { matches as fallbackMatches } from '../src/shared/mock/matches';
import { metaTrends } from '../src/shared/mock/metaTrends';
import { news as fallbackNews } from '../src/shared/mock/news';
import { patches } from '../src/shared/mock/patches';
import { teams } from '../src/shared/mock/teams';
import type {
  ChampionCatalogItem,
  DataDragonInfo,
  IngestMetadata,
  IngestSourceStatus,
  NewsItem,
  PatchNote,
} from '../src/shared/types';
import { createId } from '../src/shared/utils/id';
import { normalizeLolEsportsMatches } from './normalizers/matchNormalizer';
import { normalizeOfficialLolNews } from './normalizers/newsNormalizer';
import { fetchLolEsportsSchedule } from './sources/matchSources';
import { fetchOfficialLolNews } from './sources/newsSources';

type DatasetName =
  | 'champions'
  | 'dataDragon'
  | 'ingestMeta'
  | 'matches'
  | 'metaTrends'
  | 'news'
  | 'patches'
  | 'teams';
type DatasetEntry = [DatasetName, unknown];

type DatasetBuildResult = {
  entry: DatasetEntry;
  source: IngestSourceStatus;
};

type DataDragonBuildResult = {
  entries: DatasetEntry[];
  source: IngestSourceStatus;
};

type DataDragonChampionSummary = {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  image: {
    full: string;
  };
};

type DataDragonChampionResponse = {
  version: string;
  data: Record<string, DataDragonChampionSummary>;
};

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const outputDir = resolve(projectRoot, 'src/shared/generated');
const dataDragonBaseUrl = 'https://ddragon.leagueoflegends.com';
const dataDragonLanguage = 'zh_TW';

const createSourceStatus = (
  source: Omit<IngestSourceStatus, 'generatedAt'>,
): IngestSourceStatus => ({
  ...source,
  generatedAt: new Date().toISOString(),
});

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
};

const readGeneratedJson = async <T>(name: DatasetName): Promise<T> => {
  const inputPath = resolve(outputDir, `${name}.json`);
  const content = await readFile(inputPath, 'utf8');

  return JSON.parse(content) as T;
};

const createStaticDatasets = (): DatasetBuildResult[] => [
  {
    entry: ['metaTrends', metaTrends],
    source: createSourceStatus({
      dataset: 'metaTrends',
      label: 'Meta 趨勢',
      sourceName: 'Curated mock data',
      status: 'mock',
      recordCount: metaTrends.length,
    }),
  },
  {
    entry: ['teams', teams],
    source: createSourceStatus({
      dataset: 'teams',
      label: '關注隊伍',
      sourceName: 'Curated mock data',
      status: 'mock',
      recordCount: teams.length,
    }),
  },
];

const createMatchDataset = async (): Promise<DatasetBuildResult> => {
  try {
    const schedule = await fetchLolEsportsSchedule();
    const normalizedMatches = normalizeLolEsportsMatches(schedule);

    return {
      entry: ['matches', normalizedMatches],
      source: createSourceStatus({
        dataset: 'matches',
        label: '賽事資料',
        sourceName: schedule.sourceName,
        sourceUrl: schedule.sourceUrl,
        status: 'synced',
        recordCount: normalizedMatches.length,
      }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.warn(
      `LoL Esports schedule ingest failed. Falling back to mock matches. ${
        errorMessage
      }`,
    );
    return {
      entry: ['matches', fallbackMatches],
      source: createSourceStatus({
        dataset: 'matches',
        label: '賽事資料',
        sourceName: 'Curated mock data',
        status: 'fallback',
        recordCount: fallbackMatches.length,
        errorMessage,
      }),
    };
  }
};

const createNewsDataset = async (): Promise<DatasetBuildResult> => {
  try {
    const officialNews = await fetchOfficialLolNews();
    const normalizedNews = normalizeOfficialLolNews(officialNews);

    return {
      entry: ['news', normalizedNews],
      source: createSourceStatus({
        dataset: 'news',
        label: '新聞資料',
        sourceName: officialNews.sourceName,
        sourceUrl: officialNews.sourceUrl,
        status: 'synced',
        recordCount: normalizedNews.length,
      }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.warn(
      `Official LoL news ingest failed. Falling back to mock news. ${
        errorMessage
      }`,
    );
    return {
      entry: ['news', fallbackNews],
      source: createSourceStatus({
        dataset: 'news',
        label: '新聞資料',
        sourceName: 'Curated mock data',
        status: 'fallback',
        recordCount: fallbackNews.length,
        errorMessage,
      }),
    };
  }
};

const extractPatchVersion = (title: string): string | null => {
  const versionMatch = title.match(/(\d+\.\d+)/);

  return versionMatch?.[1] ?? null;
};

const isOfficialLolPatchNote = (item: NewsItem): boolean =>
  item.category === 'patch' &&
  item.title.includes('版本更新公告') &&
  !item.title.includes('聯盟戰棋') &&
  extractPatchVersion(item.title) !== null;

const createPatchDatasetFromNews = (newsItems: NewsItem[]): DatasetBuildResult => {
  const patchNotes: PatchNote[] = newsItems
    .filter(isOfficialLolPatchNote)
    .map((item) => {
      const version = extractPatchVersion(item.title) ?? 'unknown';

      return {
        id: createId('patch', `${version}-${item.title}`),
        version,
        releasedAt: item.publishedAt,
        title: item.title,
        summary: item.summary,
        championChanges: [],
        itemChanges: [],
        systemChanges: [
          {
            systemName: '官方版本公告',
            summary: '完整英雄、裝備與系統改動請查看官方公告。',
          },
        ],
        sourceUrl: item.sourceUrl,
        impactLevel: 'high',
      };
    });

  if (patchNotes.length === 0) {
    return {
      entry: ['patches', patches],
      source: createSourceStatus({
        dataset: 'patches',
        label: '版本重點',
        sourceName: 'Curated mock data',
        status: 'fallback',
        recordCount: patches.length,
        errorMessage: 'No official League of Legends patch notes were found in news ingest.',
      }),
    };
  }

  return {
    entry: ['patches', patchNotes],
    source: createSourceStatus({
      dataset: 'patches',
      label: '版本重點',
      sourceName: 'League of Legends 官方版本公告',
      sourceUrl: 'https://www.leagueoflegends.com/zh-tw/news/tags/patch-notes/',
      status: 'synced',
      recordCount: patchNotes.length,
    }),
  };
};

const fetchDataDragonDatasets = async (): Promise<DataDragonBuildResult> => {
  const versionsUrl = `${dataDragonBaseUrl}/api/versions.json`;
  const versions = await fetchJson<string[]>(versionsUrl);
  const latestVersion = versions[0];

  if (!latestVersion) {
    throw new Error('Data Dragon versions response was empty.');
  }

  const championsUrl = `${dataDragonBaseUrl}/cdn/${latestVersion}/data/${dataDragonLanguage}/champion.json`;
  const championResponse = await fetchJson<DataDragonChampionResponse>(championsUrl);
  const champions: ChampionCatalogItem[] = Object.values(championResponse.data)
    .map((champion) => ({
      id: champion.id,
      key: champion.key,
      name: champion.name,
      title: champion.title,
      tags: [...champion.tags],
      imageUrl: `${dataDragonBaseUrl}/cdn/${latestVersion}/img/champion/${champion.image.full}`,
      sourceUrl: championsUrl,
      version: championResponse.version,
    }))
    .sort((championA, championB) => championA.name.localeCompare(championB.name, 'zh-Hant'));
  const dataDragonInfo: DataDragonInfo = {
    latestVersion,
    language: dataDragonLanguage,
    championCount: champions.length,
    generatedAt: new Date().toISOString(),
    versions,
    sourceUrls: {
      versions: versionsUrl,
      champions: championsUrl,
    },
  };

  return {
    entries: [
      ['champions', champions],
      ['dataDragon', dataDragonInfo],
    ],
    source: createSourceStatus({
      dataset: 'champions',
      label: '英雄資料',
      sourceName: 'Riot Data Dragon',
      sourceUrl: championsUrl,
      status: 'synced',
      recordCount: champions.length,
    }),
  };
};

const createDataDragonDatasets = async (): Promise<DataDragonBuildResult> => {
  try {
    return await fetchDataDragonDatasets();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cachedChampions = await readGeneratedJson<ChampionCatalogItem[]>('champions');
    const cachedDataDragonInfo = await readGeneratedJson<DataDragonInfo>('dataDragon');

    console.warn(
      `Data Dragon ingest failed. Falling back to generated cache. ${errorMessage}`,
    );

    return {
      entries: [
        ['champions', cachedChampions],
        ['dataDragon', cachedDataDragonInfo],
      ],
      source: createSourceStatus({
        dataset: 'champions',
        label: '英雄資料',
        sourceName: 'Generated Data Dragon cache',
        sourceUrl: cachedDataDragonInfo.sourceUrls.champions,
        status: 'fallback',
        recordCount: cachedChampions.length,
        errorMessage,
      }),
    };
  }
};

const writeJson = async (name: DatasetName, data: unknown) => {
  const outputPath = resolve(outputDir, `${name}.json`);
  const normalizedJson = `${JSON.stringify(data, null, 2)}\n`;

  await writeFile(outputPath, normalizedJson, 'utf8');
  console.info(`Generated ${outputPath}`);
};

const ingest = async () => {
  await mkdir(outputDir, { recursive: true });
  const dataDragonResult = await createDataDragonDatasets();
  const matchDataset = await createMatchDataset();
  const newsDataset = await createNewsDataset();
  const patchDataset = createPatchDatasetFromNews(newsDataset.entry[1] as NewsItem[]);
  const staticDatasets = createStaticDatasets();
  const metadata: IngestMetadata = {
    generatedAt: new Date().toISOString(),
    sources: [
      newsDataset.source,
      matchDataset.source,
      dataDragonResult.source,
      patchDataset.source,
      ...staticDatasets.map((dataset) => dataset.source),
    ],
  };
  const datasets: DatasetEntry[] = [
    ...staticDatasets.map((dataset) => dataset.entry),
    matchDataset.entry,
    newsDataset.entry,
    patchDataset.entry,
    ...dataDragonResult.entries,
    ['ingestMeta', metadata],
  ];

  await Promise.all(datasets.map(([name, data]) => writeJson(name, data)));
};

await ingest();
