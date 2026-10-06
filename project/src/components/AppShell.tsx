import { useAuth } from '@/lib/auth';
import type { Route } from '@/lib/router';
import {
  Home, Compass, PlusCircle, Bot, User, Bell, LogOut, Shield, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

const bottomNav: { route: Route; label: string; icon: typeof Home }[] = [
  { route: 'home', label: 'Home', icon: Home },
  { route: 'explore', label: 'Explore', icon: Compass },
  { route: 'report', label: 'Report', icon: PlusCircle },
  { route: 'ai', label: 'AI', icon: Bot },
  { route: 'profile', label: 'Profile', icon: User },
];

export function AppShell({
  route, navigate, children,
}: {
  route: Route;
  navigate: (r: Route, p?: Record<string, string>) => void;
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { label: string; route: Route }[] = [
    { label: 'Home', route: 'home' },
    { label: 'AI Saathi', route: 'ai' },
    { label: 'Report Issue', route: 'report' },
    { label: 'My Reports', route: 'reports' },
    { label: 'Smart Map', route: 'map' },
    { label: 'Explore', route: 'explore' },
    { label: 'Alerts', route: 'alerts' },
  ];

  if (user?.role === 'admin') {
    return <AdminShell route={route} navigate={navigate}>{children}</AdminShell>;
  }

  return (
    <div className="min-h-screen bg-navy-50/40">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <button onClick={() => navigate('home')} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 font-bold text-white">N</div>
            <span className="hidden font-bold tracking-tight text-navy-900 sm:block">NAGPUR SAATHI</span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${route === item.route ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => navigate('notifications')} className="relative rounded-lg p-2 text-navy-600 hover:bg-navy-50" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <button onClick={() => navigate('profile')} className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-navy-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-100 text-sm font-bold text-saffron-700">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <span className="hidden text-sm font-medium text-navy-700 sm:block">{user?.name?.split(' ')[0]}</span>
            </button>
            <button onClick={() => setMenuOpen(o => !o)} className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 lg:hidden" aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-navy-100 bg-white px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <button
                  key={item.route}
                  onClick={() => { navigate(item.route); setMenuOpen(false); }}
                  className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium ${route === item.route ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-700'}`}
                >
                  {item.label}
                </button>
              ))}
              <button onClick={() => { logout(); navigate('login'); }} className="col-span-2 rounded-lg bg-red-50 px-3 py-2.5 text-left text-sm font-medium text-red-600">
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 lg:pb-10">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-navy-100 bg-white/95 backdrop-blur-md safe-bottom lg:hidden">
        <div className="flex items-center justify-around px-2 py-1.5">
          {bottomNav.map(item => {
            const Icon = item.icon;
            const active = route === item.route || (item.route === 'report' && route === 'report');
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium ${active ? 'text-navy-900' : 'text-navy-400'}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? 'text-saffron-500' : ''} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function AdminShell({
  route, navigate, children,
}: {
  route: Route;
  navigate: (r: Route, p?: Record<string, string>) => void;
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const items: { label: string; route: Route; icon: typeof Home }[] = [
    { label: 'Command Center', route: 'admin', icon: Shield },
    { label: 'Complaints', route: 'reports', icon: Home },
    { label: 'Rescue Cases', route: 'rescue', icon: Home },
    { label: 'City Alerts', route: 'alerts', icon: Bell },
  ];
  return (
    <div className="min-h-screen bg-navy-50/40">
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-navy-950 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-saffron-500 font-bold">N</div>
            <div>
              <p className="text-sm font-bold leading-none">ADMIN COMMAND CENTER</p>
              <p className="text-[11px] text-navy-300">Nagpur Saathi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('admin')} className={`hidden rounded-lg px-3 py-1.5 text-sm font-medium sm:block ${route === 'admin' ? 'bg-white/10' : 'hover:bg-white/5'}`}>Dashboard</button>
            <button onClick={() => { logout(); navigate('login'); }} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20">
              <LogOut size={16} /> Exit
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {items.map(item => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${route === item.route ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-100'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
