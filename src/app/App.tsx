import { useEffect, useMemo, useState } from 'react';
import { PageShell } from '../shared/components/PageShell';
import { appRoutes } from './routes';

const getHashPath = (): string => {
  const hashPath = window.location.hash.replace(/^#/, '');
  return hashPath || '/';
};

export const App = () => {
  const [activePath, setActivePath] = useState(getHashPath);
  const currentRoute = useMemo(
    () => appRoutes.find((route) => route.path === activePath) ?? appRoutes[0],
    [activePath],
  );

  useEffect(() => {
    const handleHashChange = () => setActivePath(getHashPath());
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
    setActivePath(path);
  };

  return (
    <PageShell activePath={currentRoute.path} routes={appRoutes} onNavigate={handleNavigate}>
      {currentRoute.element}
    </PageShell>
  );
};
