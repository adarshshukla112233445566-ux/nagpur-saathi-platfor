import type { Route } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import {
  Bus, TrafficCone, Hospital, Trees, Trash2, Lightbulb, Dog, Siren,
  Bot, MapPin, Bell, AlertTriangle, ChevronRight, PlusCircle,
} from 'lucide-react';

const services = [
  { label: 'Transport', icon: Bus, route: 'transport' as Route, color: 'bg-blue-50 text-blue-600' },
  { label: 'Traffic', icon: TrafficCone, route: 'traffic' as Route, color: 'bg-amber-50 text-amber-600' },
  { label: 'Hospitals', icon: Hospital, route: 'hospitals' as Route, color: 'bg-rose-50 text-rose-600' },
  { label: 'Explore', icon: Trees, route: 'explore' as Route, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Garbage', icon: Trash2, route: 'report' as Route, color: 'bg-slate-50 text-slate-600' },
  { label: 'Streetlight', icon: Lightbulb, route: 'report' as Route, color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Animal Rescue', icon: Dog, route: 'rescue' as Route, color: 'bg-orange-50 text-orange-600' },
  { label: 'Emergency', icon: Siren, route: 'hospitals' as Route, color: 'bg-red-50 text-red-600' },
];

export function HomePage({ navigate }: { navigate: (r: Route, p?: Record<string, string>) => void }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Citizen';

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-950 p-6 text-white sm:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-navy-700/40 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-saffron-500/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-navy-200">Namaste, {firstName}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Your City. Your Companion.</h1>
          <p className="mt-2 max-w-md text-navy-200">Report issues, get emergency help, and explore Nagpur — all in one smart city super app.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate('report')} className="btn-accent">
              <PlusCircle size={18} /> Report an Issue
            </button>
            <button onClick={() => navigate('hospitals')} className="btn-ghost bg-white/10 text-white ring-white/20 hover:bg-white/20">
              <Siren size={18} /> Emergency Help
            </button>
            <button onClick={() => navigate('ai')} className="btn-ghost bg-white/10 text-white ring-white/20 hover:bg-white/20">
              <Bot size={18} /> Ask AI Saathi
            </button>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Active Services', value: '8', icon: Bot },
          { label: 'City Alerts', value: '4', icon: Bell },
          { label: 'Open Reports', value: '—', icon: AlertTriangle },
          { label: 'Saved Places', value: '—', icon: MapPin },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-xs text-navy-400">{s.label}</p>
              <p className="text-lg font-bold text-navy-900">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick services */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">Quick Services</h2>
          <button onClick={() => navigate('explore')} className="text-sm font-semibold text-navy-600 hover:text-navy-900">
            Explore all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {services.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => navigate(s.route, s.label === 'Garbage' || s.label === 'Streetlight' ? { category: s.label } : undefined)}
                className="card group flex items-center gap-3 text-left transition hover:shadow-soft active:scale-[0.98]"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900">{s.label}</p>
                </div>
                <ChevronRight size={16} className="text-navy-300 transition group-hover:translate-x-0.5" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Secondary actions */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <button onClick={() => navigate('map')} className="card flex items-center gap-3 text-left transition hover:shadow-soft">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><MapPin size={20} /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-900">Smart City Map</p>
            <p className="text-xs text-navy-400">Traffic, hospitals, complaints & more</p>
          </div>
          <ChevronRight size={16} className="text-navy-300" />
        </button>
        <button onClick={() => navigate('alerts')} className="card flex items-center gap-3 text-left transition hover:shadow-soft">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Bell size={20} /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-900">City Alerts</p>
            <p className="text-xs text-navy-400">Traffic, weather & civic notices</p>
          </div>
          <ChevronRight size={16} className="text-navy-300" />
        </button>
        <button onClick={() => navigate('reports')} className="card flex items-center gap-3 text-left transition hover:shadow-soft">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><AlertTriangle size={20} /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-900">My Reports</p>
            <p className="text-xs text-navy-400">Track your complaints & rescues</p>
          </div>
          <ChevronRight size={16} className="text-navy-300" />
        </button>
      </section>
    </div>
  );
}
