import generatedChampions from '../generated/champions.json';
import generatedDataDragonInfo from '../generated/dataDragon.json';
import type { ChampionCatalogItem, DataDragonInfo } from '../types';

const cloneChampions = (items: ChampionCatalogItem[]): ChampionCatalogItem[] =>
  items.map((champion) => ({
    ...champion,
    tags: [...champion.tags],
  }));

const cloneDataDragonInfo = (info: DataDragonInfo): DataDragonInfo => ({
  ...info,
  versions: [...info.versions],
  sourceUrls: { ...info.sourceUrls },
});

export const getInitialChampionCatalog = (): ChampionCatalogItem[] =>
  cloneChampions(generatedChampions as ChampionCatalogItem[]);

export const getInitialDataDragonInfo = (): DataDragonInfo =>
  cloneDataDragonInfo(generatedDataDragonInfo as DataDragonInfo);

export const fetchChampionCatalog = async (): Promise<ChampionCatalogItem[]> =>
  getInitialChampionCatalog();

export const fetchDataDragonInfo = async (): Promise<DataDragonInfo> => getInitialDataDragonInfo();
