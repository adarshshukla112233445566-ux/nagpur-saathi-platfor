import { useEffect, useState } from 'react';
import type { Route } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import { listSavedPlaces } from '@/lib/data';
import { destinations } from '@/lib/demoData';
import { useToast } from '@/lib/toast';
import { ArrowLeft, User, FileText, Bookmark, Bell, Settings, ShieldCheck, LogOut, ChevronRight, MapPin } from 'lucide-react';

export function ProfilePage({ navigate }: { navigate: (r: Route) => void }) {
  const { user, logout } = useAuth();
  const { show } = useToast();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    listSavedPlaces().then(items => setSavedIds(items.map(item => item.place_id)));
  }, []);

  const logoutUser = () => {
    logout();
    navigate('login');
  };

  const items = [
    { label: 'My Reports', description: 'Track your complaints and rescue cases', icon: FileText, route: 'reports' as Route },
    { label: 'Saved Places', description: `${savedIds.length} places saved`, icon: Bookmark, route: 'explore' as Route },
    { label: 'Notifications', description: 'View your latest updates', icon: Bell, route: 'notifications' as Route },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold text-navy-900">Profile</h1>
      <p className="mt-1 text-sm text-navy-400">Manage your Nagpur Saathi account.</p>

      <div className="card mt-5 flex items-center gap-4 bg-navy-950 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-500 text-2xl font-bold">{user?.name?.charAt(0).toUpperCase() ?? 'U'}</div>
        <div className="flex-1">
          <p className="text-lg font-bold">{user?.name ?? 'Citizen'}</p>
          <p className="text-sm text-navy-200">{user?.email}</p>
          <p className="mt-0.5 text-xs text-navy-300">{user?.mobile}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Citizen</span>
      </div>

      <div className="mt-4 space-y-3">
        {items.map(item => (
          <button key={item.label} onClick={() => navigate(item.route)} className="card flex w-full items-center gap-3 text-left transition hover:shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600"><item.icon size={18} /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-900">{item.label}</p>
              <p className="text-xs text-navy-400">{item.description}</p>
            </div>
            <ChevronRight size={18} className="text-navy-300" />
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-base font-bold text-navy-900">Account</h2>
        <div className="card divide-y divide-navy-50 p-0">
          <button onClick={() => show('Settings are ready for the next account update.')} className="flex w-full items-center gap-3 p-4 text-left hover:bg-navy-50/50">
            <Settings size={18} className="text-navy-500" /><span className="flex-1 text-sm font-medium text-navy-800">Settings</span><ChevronRight size={16} className="text-navy-300" />
          </button>
          <button onClick={() => show('Your reports are protected in this demo account.')} className="flex w-full items-center gap-3 p-4 text-left hover:bg-navy-50/50">
            <ShieldCheck size={18} className="text-navy-500" /><span className="flex-1 text-sm font-medium text-navy-800">Privacy & Security</span><ChevronRight size={16} className="text-navy-300" />
          </button>
          <button onClick={logoutUser} className="flex w-full items-center gap-3 p-4 text-left hover:bg-red-50">
            <LogOut size={18} className="text-red-500" /><span className="flex-1 text-sm font-medium text-red-600">Logout</span><ChevronRight size={16} className="text-red-300" />
          </button>
        </div>
      </div>

      {savedIds.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-base font-bold text-navy-900">Saved Places</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {destinations.filter(d => savedIds.includes(d.id)).map(place => (
              <button key={place.id} onClick={() => navigate('explore')} className="card flex items-center gap-3 text-left">
                <img src={place.image} alt={place.name} className="h-14 w-14 rounded-xl object-cover" />
                <div><p className="text-sm font-semibold text-navy-900">{place.name}</p><p className="flex items-center gap-1 text-xs text-navy-400"><MapPin size={11} /> {place.location}</p></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
