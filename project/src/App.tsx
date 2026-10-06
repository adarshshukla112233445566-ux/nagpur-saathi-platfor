import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { ToastProvider } from '@/lib/toast';
import { useRouter } from '@/lib/router';
import { AppShell } from '@/components/AppShell';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { AiPage } from '@/pages/AiPage';
import { ReportPage } from '@/pages/ReportPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ReportDetailPage } from '@/pages/ReportDetailPage';
import { MapPage } from '@/pages/MapPage';
import { TransportPage } from '@/pages/TransportPage';
import { TrafficPage } from '@/pages/TrafficPage';
import { HospitalsPage } from '@/pages/HospitalsPage';
import { RescuePage } from '@/pages/RescuePage';
import { ExplorePage } from '@/pages/ExplorePage';
import { AlertsPage } from '@/pages/AlertsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import type { Route } from '@/lib/router';

function AppContent() {
  const { user } = useAuth();
  const { route, params, navigate } = useRouter();

  useEffect(() => {
    if (!user && route !== 'login') navigate('login');
    if (user && route === 'login') navigate(user.role === 'admin' ? 'admin' : 'home');
    if (user?.role === 'citizen' && route === 'admin') navigate('home');
  }, [user, route, navigate]);

  if (!user || route === 'login') return <AuthPage navigate={navigate} />;

  const page = renderPage(route, params, navigate, user.role);
  return <AppShell route={route} navigate={navigate}>{page}</AppShell>;
}

function renderPage(route: Route, params: Record<string, string>, navigate: (r: Route, p?: Record<string, string>) => void, role: 'citizen' | 'admin') {
  if (role === 'admin' && (route === 'admin' || route === 'reports' || route === 'rescue')) return <AdminPage navigate={navigate} />;

  switch (route) {
    case 'home': return <HomePage navigate={navigate} />;
    case 'ai': return <AiPage navigate={navigate} />;
    case 'report': return <ReportPage navigate={navigate} initialCategory={params.category} />;
    case 'reports': return <ReportsPage navigate={navigate} />;
    case 'report-detail': return <ReportDetailPage navigate={navigate} id={params.id ?? ''} />;
    case 'map': return <MapPage navigate={navigate} />;
    case 'transport': return <TransportPage navigate={navigate} />;
    case 'traffic': return <TrafficPage navigate={navigate} />;
    case 'hospitals': return <HospitalsPage navigate={navigate} />;
    case 'rescue': return <RescuePage navigate={navigate} />;
    case 'explore': return <ExplorePage navigate={navigate} />;
    case 'alerts': return <AlertsPage navigate={navigate} />;
    case 'notifications': return <NotificationsPage navigate={navigate} />;
    case 'profile': return <ProfilePage navigate={navigate} />;
    case 'admin': return <AdminPage navigate={navigate} />;
    default: return <HomePage navigate={navigate} />;
  }
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
