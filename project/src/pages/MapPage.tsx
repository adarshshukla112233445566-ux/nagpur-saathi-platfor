import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Route } from '@/lib/router';
import { mapMarkers, type MapMarker } from '@/lib/demoData';
import { Search, MapPin, Locate, Layers, X, Navigation, LoaderCircle } from 'lucide-react';

const NAGPUR_CENTER: [number, number] = [21.1458, 79.0882];
const layers = ['Traffic', 'Hospitals', 'Police', 'Fire', 'Complaints', 'Animal Rescue', 'Tourist Places', 'Parks'] as const;
const layerColors: Record<string, string> = {
  Traffic: 'bg-amber-500',
  Hospitals: 'bg-rose-500',
  Police: 'bg-blue-500',
  Fire: 'bg-red-500',
  Complaints: 'bg-navy-600',
  'Animal Rescue': 'bg-orange-500',
  'Tourist Places': 'bg-emerald-500',
  Parks: 'bg-green-500',
};
const layerHex: Record<string, string> = {
  Traffic: '#f59e0b',
  Hospitals: '#f43f5e',
  Police: '#3b82f6',
  Fire: '#ef4444',
  Complaints: '#2540d6',
  'Animal Rescue': '#f97316',
  'Tourist Places': '#10b981',
  Parks: '#22c55e',
};

function markerPosition(marker: MapMarker): [number, number] {
  return [NAGPUR_CENTER[0] + (50 - marker.y) * 0.045, NAGPUR_CENTER[1] + (marker.x - 50) * 0.06];
}

export function MapPage({ navigate }: { navigate: (r: Route, p?: Record<string, string>) => void }) {
  const [active, setActive] = useState<Set<string>>(new Set(layers));
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'located' | 'error'>('idle');
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);

  const visible = useMemo(
    () => mapMarkers.filter(m => active.has(m.layer) && (!query || m.label.toLowerCase().includes(query.toLowerCase()))),
    [active, query],
  );

  useEffect(() => {
    if (!mapElementRef.current) return;

    const map = L.map(mapElementRef.current, { zoomControl: false }).setView(NAGPUR_CENTER, 12);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      userLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = markerLayerRef.current;
    if (!layer) return;

    layer.clearLayers();
    visible.forEach(marker => {
      const circle = L.circleMarker(markerPosition(marker), {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: layerHex[marker.layer],
        fillOpacity: 1,
      });
      circle.bindTooltip(marker.label, { direction: 'top', offset: [0, -8] });
      circle.on('click', () => setSelected(marker));
      circle.addTo(layer);
    });
  }, [visible]);

  const toggle = (layerName: string) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(layerName)) next.delete(layerName); else next.add(layerName);
      return next;
    });
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      position => {
        const point: [number, number] = [position.coords.latitude, position.coords.longitude];
        const map = mapRef.current;
        const userLayer = userLayerRef.current;
        if (!map || !userLayer) return;

        userLayer.clearLayers();
        L.circle(point, {
          radius: position.coords.accuracy,
          color: '#2563eb',
          fillColor: '#60a5fa',
          fillOpacity: 0.14,
          weight: 1,
        }).addTo(userLayer);
        L.circleMarker(point, {
          radius: 8,
          color: '#ffffff',
          weight: 3,
          fillColor: '#2563eb',
          fillOpacity: 1,
        }).bindTooltip('Your current location', { direction: 'top', offset: [0, -8] }).addTo(userLayer);
        map.setView(point, 15, { animate: true });
        setLocationStatus('located');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron-600">Live civic map</p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900">Smart City Map</h1>
          <p className="mt-1 text-sm text-navy-400">Explore civic points across Nagpur with live map and location support.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> OpenStreetMap live tiles</span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-navy-400" />
          <input className="input pl-9" placeholder="Search places, hospitals, complaints..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <button onClick={locateUser} className="btn-ghost" disabled={locationStatus === 'locating'}>
          {locationStatus === 'locating' ? <LoaderCircle size={16} className="animate-spin" /> : <Locate size={16} />}
          {locationStatus === 'located' ? 'Location found' : 'Use my location'}
        </button>
      </div>
      {locationStatus === 'error' && <p className="mt-2 text-xs font-medium text-red-600">Location access was unavailable. Please allow location permission and try again.</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {layers.map(layer => (
          <button key={layer} onClick={() => toggle(layer)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${active.has(layer) ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-400'}`}>
            <span className={`h-2 w-2 rounded-full ${layerColors[layer]}`} /> {layer}
          </button>
        ))}
      </div>

      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-3xl bg-[#e7eef5] ring-1 ring-navy-100 sm:aspect-[16/9]">
        <div ref={mapElementRef} className="absolute inset-0 z-0" />
        <div className="pointer-events-none absolute left-3 top-3 z-[400] rounded-lg bg-white/95 px-3 py-2 text-[10px] font-semibold text-navy-600 shadow-sm"><Navigation size={12} className="mr-1 inline text-navy-500" /> Nagpur, Maharashtra</div>
        <div className="absolute right-3 top-3 z-[400] flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-semibold text-navy-500 shadow-sm"><Layers size={12} /> {visible.length} markers</div>
        <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg bg-white/95 px-2 py-1 text-[10px] font-medium text-navy-500 shadow-sm">Live map data · Civic markers are demo points</div>
      </div>

      {selected && (
        <div className="card mt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${layerColors[selected.layer]}`}><MapPin size={18} /></span>
              <div><p className="text-base font-bold text-navy-900">{selected.label}</p><p className="text-xs text-navy-400">{selected.layer}</p></div>
            </div>
            <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50"><X size={18} /></button>
          </div>
          <p className="mt-3 text-sm text-navy-700">{selected.detail}</p>
          {selected.layer === 'Complaints' && <button onClick={() => navigate('report-detail', { id: selected.id })} className="btn-ghost mt-3">View Complaint</button>}
          {selected.layer === 'Animal Rescue' && <button onClick={() => navigate('report-detail', { id: selected.id })} className="btn-ghost mt-3">View Rescue</button>}
          {selected.layer === 'Tourist Places' && <button onClick={() => navigate('explore')} className="btn-ghost mt-3">Explore Destination</button>}
        </div>
      )}
    </div>
  );
}
