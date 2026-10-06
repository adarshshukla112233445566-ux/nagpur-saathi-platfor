import { useEffect, useState } from 'react';
import type { Route } from '@/lib/router';
import { destinations, type Destination } from '@/lib/demoData';
import { listSavedPlaces, savePlace, unsavePlace } from '@/lib/data';
import { useToast } from '@/lib/toast';
import { ArrowLeft, MapPin, Bookmark, BookmarkCheck, X } from 'lucide-react';

const categories = ['All', 'Lakes', 'Parks', 'Heritage', 'Food', 'Family', 'Events'] as const;

export function ExplorePage({ navigate }: { navigate: (r: Route) => void }) {
  const { show } = useToast();
  const [active, setActive] = useState<typeof categories[number]>('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Destination | null>(null);

  useEffect(() => {
    listSavedPlaces().then(places => setSaved(new Set(places.map(p => p.place_id))));
  }, []);

  const toggleSave = async (id: string) => {
    if (saved.has(id)) {
      await unsavePlace(id);
      setSaved(s => { const n = new Set(s); n.delete(id); return n; });
      show('Removed from saved places.');
    } else {
      await savePlace(id);
      setSaved(s => new Set(s).add(id));
      show('Saved to your places.');
    }
  };

  const featured = destinations.filter(d => d.featured);
  const list = active === 'All' ? destinations : destinations.filter(d => d.category === active);

  return (
    <div className="mx-auto max-w-5xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold text-navy-900">Explore Nagpur</h1>
      <p className="mt-1 text-sm text-navy-400">Discover lakes, parks, heritage, food and more across the city.</p>

      {/* Featured */}
      <section className="mt-6">
        <h2 className="mb-3 text-base font-bold text-navy-900">Featured Destination</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {featured.map(d => (
            <button key={d.id} onClick={() => setSelected(d)} className="group relative overflow-hidden rounded-2xl text-left shadow-card">
              <img src={d.image} alt={d.name} className="h-44 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="text-sm font-bold">{d.name}</p>
                <p className="flex items-center gap-1 text-xs text-navy-100"><MapPin size={11} /> {d.location}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Category filter */}
      <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map(c => (
          <button key={c} onClick={() => setActive(c)} className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${active === c ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600'}`}>{c}</button>
        ))}
      </div>

      {/* Popular */}
      <section className="mt-5">
        <h2 className="mb-3 text-base font-bold text-navy-900">Popular Places</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(d => (
            <div key={d.id} className="card overflow-hidden p-0">
              <button onClick={() => setSelected(d)} className="block w-full text-left">
                <img src={d.image} alt={d.name} className="h-40 w-full object-cover" />
              </button>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => setSelected(d)} className="text-left">
                    <p className="text-sm font-bold text-navy-900">{d.name}</p>
                    <p className="flex items-center gap-1 text-xs text-navy-400"><MapPin size={11} /> {d.location}</p>
                  </button>
                  <button onClick={() => toggleSave(d.id)} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50" aria-label="Save">
                    {saved.has(d.id) ? <BookmarkCheck size={18} className="text-saffron-500" /> : <Bookmark size={18} />}
                  </button>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-navy-600">{d.description}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setSelected(d)} className="btn-ghost flex-1 px-3 py-2 text-xs">View Details</button>
                  <button onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(d.name + ' ' + d.location)}`, '_blank')} className="btn-ghost px-3 py-2 text-xs">Directions</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-lg animate-slide-up overflow-hidden rounded-t-3xl bg-white shadow-soft sm:animate-scale-in sm:rounded-3xl max-h-[90vh] overflow-y-auto">
            <img src={selected.image} alt={selected.name} className="h-56 w-full object-cover" />
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-navy-700 shadow-card"><X size={18} /></button>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-600">{selected.category}</span>
                  <h3 className="mt-2 text-xl font-bold text-navy-900">{selected.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-navy-400"><MapPin size={12} /> {selected.location}</p>
                </div>
                <button onClick={() => toggleSave(selected.id)} className="btn-ghost px-3 py-2 text-xs">
                  {saved.has(selected.id) ? <><BookmarkCheck size={14} className="text-saffron-500" /> Saved</> : <><Bookmark size={14} /> Save</>}
                </button>
              </div>
              <p className="mt-4 text-sm text-navy-700">{selected.description}</p>
              <div className="mt-5 flex gap-2">
                <button onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selected.name + ' ' + selected.location)}`, '_blank')} className="btn-primary flex-1">Get Directions</button>
                <button onClick={() => setSelected(null)} className="btn-ghost">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
