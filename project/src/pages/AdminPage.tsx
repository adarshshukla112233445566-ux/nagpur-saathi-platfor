import { useEffect, useMemo, useState } from 'react';
import type { Route } from '@/lib/router';
import { listComplaints, listRescues, updateComplaintStatus, updateRescueStatus, createNotification } from '@/lib/data';
import type { Complaint, ComplaintStatus, Priority, Rescue, RescueStatus } from '@/lib/types';
import { COMPLAINT_TIMELINE, RESCUE_TIMELINE } from '@/lib/types';
import { StatusBadge, PriorityBadge, LoadingState, ErrorState, EmptyState } from '@/components/ui';
import { useToast } from '@/lib/toast';
import { AlertTriangle, CheckCircle2, ClipboardList, Dog, FileText, RefreshCw, Shield, Users, Building2, Siren } from 'lucide-react';

export function AdminPage({ navigate }: { navigate: (r: Route, p?: Record<string, string>) => void }) {
  const { show } = useToast();
  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [rescues, setRescues] = useState<Rescue[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<'complaints' | 'rescues'>('complaints');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setError(false);
    try {
      const [c, r] = await Promise.all([listComplaints(), listRescues()]);
      setComplaints(c); setRescues(r);
    } catch { setError(true); }
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const c = complaints ?? [];
    const r = rescues ?? [];
    return [
      { label: 'Open Cases', value: c.filter(x => x.status !== 'Resolved').length, icon: ClipboardList, color: 'bg-blue-50 text-blue-600' },
      { label: 'Critical Cases', value: c.filter(x => x.priority === 'Critical').length, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
      { label: 'Resolved Cases', value: c.filter(x => x.status === 'Resolved').length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
      { label: 'Rescue Cases', value: r.filter(x => x.status !== 'Resolved').length, icon: Dog, color: 'bg-orange-50 text-orange-600' },
    ];
  }, [complaints, rescues]);

  const changeComplaint = async (id: string, status: ComplaintStatus, priority?: Priority) => {
    setUpdating(id);
    await updateComplaintStatus(id, status, priority);
    setComplaints(current => current?.map(item => item.complaint_id === id ? { ...item, status, ...(priority ? { priority } : {}) } : item) ?? null);
    await createNotification(`Complaint ${id} updated`, `Your complaint status is now ${status}.`);
    show(`Complaint ${id} updated to ${status}.`);
    setUpdating(null);
  };

  const changeRescue = async (id: string, status: RescueStatus) => {
    setUpdating(id);
    await updateRescueStatus(id, status);
    setRescues(current => current?.map(item => item.rescue_id === id ? { ...item, status } : item) ?? null);
    await createNotification(`Rescue ${id} updated`, `Your rescue case status is now ${status}.`);
    show(`Rescue ${id} updated to ${status}.`);
    setUpdating(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><Shield size={18} className="text-saffron-500" /><p className="text-xs font-bold uppercase tracking-wide text-saffron-600">Demo admin workspace</p></div>
          <h1 className="mt-1 text-2xl font-bold text-navy-900">Command Center</h1>
          <p className="mt-1 text-sm text-navy-400">Manage civic reports and rescue operations for Nagpur.</p>
        </div>
        <button onClick={load} className="btn-ghost"><RefreshCw size={15} /> Refresh data</button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(stat => <div key={stat.label} className="card flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}><stat.icon size={18} /></div><div><p className="text-xs text-navy-400">{stat.label}</p><p className="text-xl font-bold text-navy-900">{stat.value}</p></div></div>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-navy-100 p-1">
              <button onClick={() => setTab('complaints')} className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${tab === 'complaints' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'}`}><FileText size={14} className="mr-1 inline" /> Complaints</button>
              <button onClick={() => setTab('rescues')} className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${tab === 'rescues' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'}`}><Dog size={14} className="mr-1 inline" /> Rescue</button>
            </div>
          </div>

          {error ? <ErrorState message="Unable to load command center data." onRetry={load} /> :
            tab === 'complaints' ? (
              complaints === null ? <LoadingState /> : complaints.length === 0 ? <EmptyState title="No complaints yet" subtitle="Citizen reports will appear here." /> :
              <div className="space-y-3">{complaints.map(c => <ComplaintAdminCard key={c.complaint_id} complaint={c} disabled={updating === c.complaint_id} onUpdate={changeComplaint} onOpen={() => navigate('report-detail', { id: c.complaint_id })} />)}</div>
            ) : (
              rescues === null ? <LoadingState /> : rescues.length === 0 ? <EmptyState title="No rescue cases yet" subtitle="Animal rescue reports will appear here." /> :
              <div className="space-y-3">{rescues.map(r => <RescueAdminCard key={r.rescue_id} rescue={r} disabled={updating === r.rescue_id} onUpdate={changeRescue} onOpen={() => navigate('report-detail', { id: r.rescue_id })} />)}</div>
            )}
        </section>

        <aside className="space-y-3">
          <h2 className="text-sm font-bold text-navy-900">Operations overview</h2>
          <div className="card space-y-4">
            <OverviewRow icon={Users} label="Citizen users" value="Demo accounts" />
            <OverviewRow icon={Building2} label="Departments" value="8 active" />
            <OverviewRow icon={Siren} label="Incidents" value="Simulated data" />
          </div>
          <div className="rounded-2xl bg-navy-950 p-4 text-white">
            <p className="text-sm font-bold">Status changes are connected</p>
            <p className="mt-1 text-xs leading-relaxed text-navy-200">Updates made here are saved to the shared civic data and appear in the citizen tracking view.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ComplaintAdminCard({ complaint, disabled, onUpdate, onOpen }: { complaint: Complaint; disabled: boolean; onUpdate: (id: string, status: ComplaintStatus, priority?: Priority) => void; onOpen: () => void }) {
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button onClick={onOpen} className="flex min-w-0 items-start gap-3 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600"><FileText size={18} /></div>
          <div className="min-w-0"><p className="truncate text-sm font-bold text-navy-900">{complaint.complaint_id}</p><p className="truncate text-xs text-navy-400">{complaint.category} · {complaint.location}</p><p className="mt-1 text-xs text-navy-600">{complaint.description}</p></div>
        </button>
        <div className="flex items-center gap-2"><PriorityBadge priority={complaint.priority} /><StatusBadge status={complaint.status} /></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-50 pt-3">
        <select disabled={disabled} value={complaint.status} onChange={e => onUpdate(complaint.complaint_id, e.target.value as ComplaintStatus)} className="input max-w-[160px] py-2 text-xs">
          {COMPLAINT_TIMELINE.map(status => <option key={status}>{status}</option>)}
        </select>
        <select disabled={disabled} value={complaint.priority} onChange={e => onUpdate(complaint.complaint_id, complaint.status, e.target.value as Priority)} className="input max-w-[120px] py-2 text-xs">
          {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(priority => <option key={priority}>{priority}</option>)}
        </select>
        <span className="ml-auto text-[11px] text-navy-300">{disabled ? 'Saving...' : 'Change status or priority'}</span>
      </div>
    </div>
  );
}

function RescueAdminCard({ rescue, disabled, onUpdate, onOpen }: { rescue: Rescue; disabled: boolean; onUpdate: (id: string, status: RescueStatus) => void; onOpen: () => void }) {
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button onClick={onOpen} className="flex min-w-0 items-start gap-3 text-left"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Dog size={18} /></div><div className="min-w-0"><p className="truncate text-sm font-bold text-navy-900">{rescue.rescue_id}</p><p className="truncate text-xs text-navy-400">{rescue.animal_type} · {rescue.location}</p><p className="mt-1 text-xs text-navy-600">{rescue.condition} · {rescue.description}</p></div></button>
        <StatusBadge status={rescue.status} />
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-navy-50 pt-3"><select disabled={disabled} value={rescue.status} onChange={e => onUpdate(rescue.rescue_id, e.target.value as RescueStatus)} className="input max-w-[180px] py-2 text-xs">{RESCUE_TIMELINE.map(status => <option key={status}>{status}</option>)}</select><span className="text-[11px] text-navy-300">{disabled ? 'Saving...' : 'Change status'}</span></div>
    </div>
  );
}

function OverviewRow({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-500"><Icon size={15} /></div><div className="flex-1"><p className="text-xs text-navy-400">{label}</p><p className="text-sm font-semibold text-navy-800">{value}</p></div></div>;
}
