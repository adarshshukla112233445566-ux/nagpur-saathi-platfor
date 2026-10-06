import { useState } from 'react';
import type { Route } from '@/lib/router';
import { transportRoutes } from '@/lib/demoData';
import { ArrowLeft, Search, Bus, Clock, MapPin, ChevronDown } from 'lucide-react';

export function TransportPage({ navigate }: { navigate: (r: Route) => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState(false);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold text-navy-900">Public Transport</h1>
      <p className="mt-1 text-sm text-navy-400">Search routes across Nagpur. Demo transport data.</p>

      <form onSubmit={search} className="card mt-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">From</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-navy-400" />
              <input className="input pl-9" value={from} onChange={e => setFrom(e.target.value)} placeholder="Starting point" />
            </div>
          </div>
          <div>
            <label className="label">To</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-navy-400" />
              <input className="input pl-9" value={to} onChange={e => setTo(e.target.value)} placeholder="Destination" />
            </div>
          </div>
        </div>
        <button type="submit" className="btn-primary mt-4 w-full">
          <Search size={16} /> Search Routes
        </button>
      </form>

      {results && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Demo Transport Data</p>
          {transportRoutes.map(r => (
            <RouteCard key={r.id} route={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function RouteCard({ route }: { route: typeof transportRoutes[number] }) {
  const [open, setOpen] = useState(false);
  const statusColor = route.status === 'On Time' ? 'bg-emerald-50 text-emerald-700' : route.status === 'Delayed' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700';
  return (
    <div className="card">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center gap-3 text-left">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-600"><Bus size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-navy-900">{route.route}</p>
          <p className="flex items-center gap-1 text-xs text-navy-400"><Clock size={12} /> {route.time}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}>{route.status}</span>
        <ChevronDown size={16} className={`text-navy-300 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-4 border-t border-navy-50 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-navy-400">Stops</p>
          <ol className="relative ml-2 border-l border-navy-100">
            {route.stops.map((s, idx) => (
              <li key={s} className="mb-3 ml-4 last:mb-0">
                <span className={`absolute -left-[7px] h-3.5 w-3.5 rounded-full ring-4 ring-white ${idx === 0 ? 'bg-emerald-500' : idx === route.stops.length - 1 ? 'bg-saffron-500' : 'bg-navy-300'}`} />
                <p className="text-sm font-medium text-navy-800">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
