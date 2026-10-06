import { useEffect, useState } from 'react';
import type { Route } from '@/lib/router';
import { listComplaints, listRescues } from '@/lib/data';
import type { Complaint, Rescue } from '@/lib/types';
import { StatusBadge, LoadingState, ErrorState, EmptyState, PriorityBadge } from '@/components/ui';
import { ArrowLeft, FileText, Dog, ChevronRight, PlusCircle } from 'lucide-react';

export function ReportsPage({ navigate }: { navigate: (r: Route, p?: Record<string, string>) => void }) {
  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [rescues, setRescues] = useState<Rescue[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<'complaints' | 'rescues'>('complaints');

  const load = async () => {
    setError(false);
    try {
      const [c, r] = await Promise.all([listComplaints(), listRescues()]);
      setComplaints(c); setRescues(r);
    } catch { setError(true); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Reports</h1>
          <p className="mt-1 text-sm text-navy-400">Track your complaints and rescue cases.</p>
        </div>
        <button onClick={() => navigate('report')} className="btn-primary hidden sm:flex">
          <PlusCircle size={16} /> New Report
        </button>
      </div>

      <div className="mt-5 inline-flex rounded-xl bg-navy-100 p-1">
        <button onClick={() => setTab('complaints')} className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${tab === 'complaints' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'}`}>Complaints</button>
        <button onClick={() => setTab('rescues')} className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${tab === 'rescues' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'}`}>Rescue Cases</button>
      </div>

      <div className="mt-5 space-y-3">
        {tab === 'complaints' && (
          complaints === null ? <LoadingState /> :
          error ? <ErrorState message="Unable to load your reports." onRetry={load} /> :
          complaints.length === 0 ? <EmptyState title="No complaints yet" subtitle="When you report an issue, it will appear here for tracking." action={<button onClick={() => navigate('report')} className="btn-primary">Report an Issue</button>} /> :
          complaints.map(c => (
            <button key={c.complaint_id} onClick={() => navigate('report-detail', { id: c.complaint_id })} className="card flex w-full items-center gap-3 text-left transition hover:shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-600"><FileText size={18} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-navy-900">{c.complaint_id}</p>
                  <PriorityBadge priority={c.priority} />
                </div>
                <p className="truncate text-xs text-navy-400">{c.category} · {c.location}</p>
              </div>
              <StatusBadge status={c.status} />
              <ChevronRight size={16} className="text-navy-300" />
            </button>
          ))
        )}

        {tab === 'rescues' && (
          rescues === null ? <LoadingState /> :
          error ? <ErrorState message="Unable to load rescue cases." onRetry={load} /> :
          rescues.length === 0 ? <EmptyState title="No rescue cases yet" subtitle="Report an injured animal to start a rescue case." action={<button onClick={() => navigate('rescue')} className="btn-primary">Report Animal</button>} /> :
          rescues.map(r => (
            <button key={r.rescue_id} onClick={() => navigate('report-detail', { id: r.rescue_id })} className="card flex w-full items-center gap-3 text-left transition hover:shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Dog size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy-900">{r.rescue_id}</p>
                <p className="truncate text-xs text-navy-400">{r.animal_type} · {r.location}</p>
              </div>
              <StatusBadge status={r.status} />
              <ChevronRight size={16} className="text-navy-300" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
