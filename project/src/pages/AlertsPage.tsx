import type { Route } from '@/lib/router';
import { cityAlerts } from '@/lib/demoData';
import { ArrowLeft, TrafficCone, CloudRain, Droplets, Siren, FileText } from 'lucide-react';

const typeIcon: Record<string, typeof TrafficCone> = {
  'Traffic': TrafficCone, 'Weather': CloudRain, 'Civic': Droplets, 'Emergency': Siren, 'Public Notice': FileText,
};
const priorityColor: Record<string, string> = {
  'Low': 'bg-slate-100 text-slate-600',
  'Medium': 'bg-blue-100 text-blue-700',
  'High': 'bg-orange-100 text-orange-700',
  'Critical': 'bg-red-100 text-red-700',
};

export function AlertsPage({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold text-navy-900">City Alerts</h1>
      <p className="mt-1 text-sm text-navy-400">Stay updated on traffic, weather, civic and emergency notices.</p>

      <div className="mt-5 space-y-3">
        {cityAlerts.map(a => {
          const Icon = typeIcon[a.type];
          return (
            <div key={a.id} className="card">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600"><Icon size={20} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-navy-900">{a.title}</p>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${priorityColor[a.priority]}`}>{a.priority}</span>
                  </div>
                  <p className="mt-1 text-xs text-navy-400">{a.type} · {a.area} · {a.time}</p>
                  <p className="mt-2 text-sm text-navy-700">{a.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
