import type { MetaTrend } from '../types';

export const metaTrends: MetaTrend[] = [
  {
    id: 'meta-control-mages',
    label: '控制法師',
    role: 'mid',
    trend: 'rising',
    value: 82,
    note: 'Faker 與 Chovy 常用的控制法師出場率上升，河道視野交換更關鍵。',
  },
  {
    id: 'meta-engage-supports',
    label: '強開輔助',
    role: 'support',
    trend: 'rising',
    value: 76,
    note: 'Keria 類型的主動開戰輔助更容易在前期建立小龍區優勢。',
  },
  {
    id: 'meta-tempo-junglers',
    label: '節奏型打野',
    role: 'jungle',
    trend: 'stable',
    value: 69,
    note: 'Oner 常用的前期節奏角仍具價值，但容錯比上版本更低。',
  },
];
