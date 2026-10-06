import { useEffect, useState } from 'react';
import type { Route } from '@/lib/router';
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/data';
import type { AppNotification } from '@/lib/types';
import { ArrowLeft, Bell, Check, CheckCheck } from 'lucide-react';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui';

export function NotificationsPage({ navigate }: { navigate: (r: Route) => void }) {
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [error, setError] = useState(false);

  const load = async () => {
    setError(false);
    try { setItems(await listNotifications()); } catch { setError(true); }
  };

  useEffect(() => { load(); }, []);

  const markOne = async (id: string) => {
    await markNotificationRead(id);
    setItems(current => current?.map(item => item.id === id ? { ...item, read: true } : item) ?? null);
  };

  const markAll = async () => {
    await markAllNotificationsRead();
    setItems(current => current?.map(item => ({ ...item, read: true })) ?? null);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
          <p className="mt-1 text-sm text-navy-400">Updates about your reports and city activity.</p>
        </div>
        {items && items.some(item => !item.read) && (
          <button onClick={markAll} className="btn-ghost px-3 py-2 text-xs"><CheckCheck size={15} /> Mark all read</button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {items === null ? <LoadingState label="Loading notifications..." /> :
          error ? <ErrorState message="Unable to load notifications." onRetry={load} /> :
          items.length === 0 ? <EmptyState title="You're all caught up" subtitle="New report and city updates will appear here." /> :
          items.map(item => (
            <button key={item.id} onClick={() => markOne(item.id)} className={`card flex w-full items-start gap-3 text-left transition hover:shadow-soft ${!item.read ? 'ring-2 ring-navy-100' : ''}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.read ? 'bg-navy-50 text-navy-400' : 'bg-saffron-50 text-saffron-600'}`}>
                {item.read ? <Check size={18} /> : <Bell size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${item.read ? 'font-medium text-navy-700' : 'font-bold text-navy-900'}`}>{item.title}</p>
                  {!item.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-saffron-500" />}
                </div>
                <p className="mt-1 text-xs text-navy-500">{item.description}</p>
                <p className="mt-2 text-[11px] text-navy-300">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
