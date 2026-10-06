import { useState } from 'react';
import type { Route } from '@/lib/router';
import { emergencyServices, type EmergencyService } from '@/lib/demoData';
import { ArrowLeft, Hospital, Shield, Flame, Ambulance, Pill, Phone, MapPin } from 'lucide-react';

const categories = ['Hospitals', 'Police', 'Fire', 'Ambulance', 'Pharmacies'] as const;
const catIcon: Record<string, typeof Hospital> = {
  'Hospitals': Hospital, 'Police': Shield, 'Fire': Flame, 'Ambulance': Ambulance, 'Pharmacies': Pill,
};
const catColor: Record<string, string> = {
  'Hospitals': 'bg-rose-50 text-rose-600',
  'Police': 'bg-blue-50 text-blue-600',
  'Fire': 'bg-red-50 text-red-600',
  'Ambulance': 'bg-orange-50 text-orange-600',
  'Pharmacies': 'bg-emerald-50 text-emerald-600',
};

export function HospitalsPage({ navigate }: { navigate: (r: Route) => void }) {
  const [active, setActive] = useState<typeof categories[number]>('Hospitals');
  const list = emergencyServices.filter(s => s.category === active);

  return (
    <div className="mx-auto max-w-4xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><Hospital size={22} /></div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Emergency Services</h1>
          <p className="text-sm text-navy-400">Hospitals, police, fire, ambulance & pharmacies</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map(c => {
          const Icon = catIcon[c];
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${active === c ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600'}`}
            >
              <Icon size={15} /> {c}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: EmergencyService }) {
  const Icon = catIcon[service.category];
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${catColor[service.category]}`}><Icon size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-navy-900">{service.name}</p>
          <p className="flex items-center gap-1 text-xs text-navy-400"><MapPin size={11} /> {service.location}</p>
          <p className="mt-1 text-xs text-navy-600">{service.service}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <a href={`tel:${service.phone}`} className="btn-primary flex-1 px-3 py-2 text-xs">
          <Phone size={14} /> Call {service.phone}
        </a>
        <button onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(service.name + ' ' + service.location)}`, '_blank')} className="btn-ghost px-3 py-2 text-xs">
          <MapPin size={14} /> Directions
        </button>
      </div>
    </div>
  );
}
