import { DashboardPage } from '../features/dashboard/DashboardPage';
import { MatchesPage } from '../features/matches/MatchesPage';
import { NewsPage } from '../features/news/NewsPage';
import { PatchesPage } from '../features/patches/PatchesPage';

export type AppRoute = {
  path: string;
  label: string;
  icon: string;
  element: React.ReactNode;
};

export const appRoutes: AppRoute[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'bi-grid-1x2',
    element: <DashboardPage />,
  },
  {
    path: '/news',
    label: 'News',
    icon: 'bi-newspaper',
    element: <NewsPage />,
  },
  {
    path: '/matches',
    label: 'Matches',
    icon: 'bi-calendar2-week',
    element: <MatchesPage />,
  },
  {
    path: '/patches',
    label: 'Patches',
    icon: 'bi-lightning-charge',
    element: <PatchesPage />,
  },
];
