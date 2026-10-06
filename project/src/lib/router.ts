import { useEffect, useState } from 'react';

export type Route =
  | 'login' | 'home' | 'ai' | 'report' | 'reports' | 'report-detail'
  | 'map' | 'transport' | 'traffic' | 'hospitals' | 'rescue' | 'explore'
  | 'alerts' | 'notifications' | 'profile' | 'admin' | 'forgot';

interface RouterState {
  route: Route;
  params: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;
}

const KEY = 'nagpur_saathi_route_v1';

export function useRouter(): RouterState {
  const [route, setRoute] = useState<Route>('login');
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { route: Route; params: Record<string, string> };
        setRoute(parsed.route);
        setParams(parsed.params ?? {});
      }
    } catch {}
  }, []);

  const navigate: RouterState['navigate'] = (r, p = {}) => {
    setRoute(r);
    setParams(p);
    sessionStorage.setItem(KEY, JSON.stringify({ route: r, params: p }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { route, params, navigate };
}
