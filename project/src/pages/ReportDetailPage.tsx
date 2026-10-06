import { useEffect, useState } from 'react';
import type { Route } from '@/lib/router';
import { listComplaints, listRescues } from '@/lib/data';
import type { Complaint, Rescue } from '@/lib/types';
import { COMPLAINT_TIMELINE, RESCUE_TIMELINE } from '@/lib/types';
import { StatusBadge, PriorityBadge, LoadingState, ErrorState, Timeline } from '@/components/ui';
import { ArrowLeft, MapPin, Calendar, FileText, Dog, ChevronRight } from 'lucide-react';

export function ReportDetailPage({
  id, navigate,
}: {
  id: string;
  navigate: (r: Route, p?: Record<string, string>) => void;
}) {
  const [record, setRecord] = useState<Complaint | Rescue | null>(null);
  const [type, setType] = useState<'complaint' | 'rescue' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const [complaints, rescues] = await Promise.all([listComplaints(), listRescues()]);
      const c = complaints.find(x => x.complaint_id === id);
      if (c) { setRecord(c); setType('complaint'); setLoading(false); return; }
      const r = rescues.find(x => x.rescue_id === id);
      if (r) { setRecord(r); setType('rescue'); setLoading(false); return; }
      setError(true); setLoading(false);
    } catch { setError(true); setLoading(false); }
  };

  useEffect(() => { load(); /* refresh when id changes */ }, [id]);

  if (loading) return <div className="mx-auto max-w-2xl"><LoadingState /></div>;
  if (error || !record) return <div className="mx-auto max-w-2xl"><ErrorState message="Unable to load this report." onRetry={load} /></div>;

  const isComplaint = type === 'complaint';
  const timeline = isComplaint ? COMPLAINT_TIMELINE : RESCUE_TIMELINE;

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('reports')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back to My Reports
      </button>

      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isComplaint ? 'bg-navy-50 text-navy-600' : 'bg-orange-50 text-orange-600'}`}>
              {isComplaint ? <FileText size={22} /> : <Dog size={22} />}
            </div>
            <div>
              <p className="text-lg font-bold text-navy-900">{id}</p>
              <p className="text-sm text-navy-400">{isComplaint ? 'Civic Complaint' : 'Animal Rescue Case'}</p>
            </div>
          </div>
          <StatusBadge status={record.status} />
        </div>

        {record.image_url && (
          <img src={record.image_url} alt="Report" className="mt-4 max-h-60 w-full rounded-2xl object-cover" />
        )}

        <div className="mt-5 space-y-3">
          {isComplaint && (
            <>
              <DetailRow icon={FileText} label="Category" value={(record as Complaint).category} />
              <DetailRow icon={MapPin} label="Location" value={record.location} />
              <DetailRow icon={Calendar} label="Reported on" value={new Date(record.created_at).toLocaleString()} />
              <DetailRow icon={FileText} label="Description" value={record.description} />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-navy-400">Priority</span>
                <PriorityBadge priority={(record as Complaint).priority} />
              </div>
            </>
          )}
          {!isComplaint && (
            <>
              <DetailRow icon={Dog} label="Animal" value={(record as Rescue).animal_type} />
              <DetailRow icon={MapPin} label="Location" value={record.location} />
              <DetailRow icon={FileText} label="Condition" value={(record as Rescue).condition} />
              <DetailRow icon={Calendar} label="Reported on" value={new Date(record.created_at).toLocaleString()} />
              <DetailRow icon={FileText} label="Description" value={record.description} />
            </>
          )}
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="text-base font-bold text-navy-900">Status Timeline</h2>
        <p className="mt-1 text-sm text-navy-400">Track the progress of your case from report to resolution.</p>
        <div className="mt-5">
          <Timeline steps={timeline} current={record.status} />
        </div>
      </div>

      <button onClick={() => navigate('reports')} className="btn-ghost mt-4 w-full">
        Back to My Reports <ChevronRight size={16} />
      </button>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-500"><Icon size={15} /></div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</p>
        <p className="text-sm font-medium text-navy-900">{value}</p>
      </div>
    </div>
  );
}
