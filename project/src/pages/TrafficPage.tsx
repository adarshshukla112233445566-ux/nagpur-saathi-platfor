import type { Route } from '@/lib/router';
import { trafficAreas, trafficIncidents } from '@/lib/demoData';
import { ArrowLeft, TrafficCone, AlertTriangle, Route as RouteIcon } from 'lucide-react';

const statusColor: Record<string, string> = {
  'Smooth': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Moderate': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Heavy': 'bg-orange-50 text-orange-700 ring-orange-200',
  'Congested': 'bg-red-50 text-red-700 ring-red-200',
};

export function TrafficPage({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="mx-auto max-w-4xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><TrafficCone size={22} /></div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Traffic Dashboard</h1>
          <p className="text-sm text-navy-400">Simulated traffic data for Nagpur</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-base font-bold text-navy-900">Congestion by Area</h2>
          <div className="space-y-3">
            {trafficAreas.map(a => (
              <div key={a.area} className="card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{a.area}</p>
                  <p className="text-xs text-navy-400">{a.detail}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusColor[a.status]}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-navy-900">Road Incidents</h2>
          <div className="space-y-3">
            {trafficIncidents.map(i => (
              <div key={i.title} className="card">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-orange-500" />
                  <p className="text-sm font-semibold text-navy-900">{i.title}</p>
                </div>
                <p className="mt-1 text-xs text-navy-400">{i.area} · {i.detail}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-6 text-base font-bold text-navy-900">Alternative Routes</h2>
          <div className="card">
            <div className="flex items-center gap-2">
              <RouteIcon size={16} className="text-emerald-500" />
              <p className="text-sm font-semibold text-navy-900">Wardha Road diversion</p>
            </div>
            <p className="mt-1 text-xs text-navy-400">Use Central Bazaar Road to bypass Gaddigodam congestion. Adds ~8 min.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
