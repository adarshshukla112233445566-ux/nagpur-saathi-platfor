import { useState } from 'react';
import type { Route } from '@/lib/router';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/lib/auth';
import { createComplaint, createNotification } from '@/lib/data';
import type { ComplaintCategory } from '@/lib/types';
import {
  Trash2, CircleDot, Lightbulb, Construction, Droplets, Waves, MoreHorizontal,
  Camera, MapPin, FileText, Check, ChevronRight, ArrowLeft,
} from 'lucide-react';

const categories: { name: ComplaintCategory; icon: typeof Trash2; color: string }[] = [
  { name: 'Garbage', icon: Trash2, color: 'bg-slate-100 text-slate-700' },
  { name: 'Pothole', icon: CircleDot, color: 'bg-amber-100 text-amber-700' },
  { name: 'Streetlight', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Road Damage', icon: Construction, color: 'bg-orange-100 text-orange-700' },
  { name: 'Water', icon: Droplets, color: 'bg-blue-100 text-blue-700' },
  { name: 'Drainage', icon: Waves, color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Other', icon: MoreHorizontal, color: 'bg-navy-100 text-navy-700' },
];

const steps = ['Category', 'Photo', 'Location', 'Description', 'Review'] as const;

export function ReportPage({
  navigate, initialCategory,
}: {
  navigate: (r: Route, p?: Record<string, string>) => void;
  initialCategory?: string;
}) {
  const { show } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<ComplaintCategory | null>(
    (initialCategory as ComplaintCategory) ?? null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canNext = () => {
    if (step === 0) return category !== null;
    if (step === 1) return true; // photo optional but encouraged
    if (step === 2) return location.trim().length > 2;
    if (step === 3) return description.trim().length > 5;
    return true;
  };

  const submit = async () => {
    if (!category || !location || !description) { setError('Please complete all required fields.'); return; }
    setBusy(true);
    setError('');
    try {
      const complaint = await createComplaint({
        category,
        location: location.trim(),
        description: description.trim(),
        image_url: imagePreview,
        created_by: user?.email ?? null,
      });
      await createNotification(
        `Complaint ${complaint.complaint_id} submitted`,
        `Your ${category} report has been received and is now being tracked.`,
      );
      show(`Complaint ${complaint.complaint_id} submitted successfully!`);
      navigate('report-detail', { id: complaint.complaint_id });
    } catch {
      setError('Unable to submit your report. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back to Home
      </button>

      <h1 className="text-2xl font-bold text-navy-900">Report an Issue</h1>
      <p className="mt-1 text-sm text-navy-400">Help improve Nagpur by reporting civic issues in your area.</p>

      {/* Stepper */}
      <div className="mt-6 flex items-center gap-1">
        {steps.map((s, idx) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${idx < step ? 'bg-emerald-500 text-white' : idx === step ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-400'}`}>
              {idx < step ? <Check size={14} /> : idx + 1}
            </div>
            <span className={`hidden text-xs font-medium sm:block ${idx === step ? 'text-navy-900' : 'text-navy-400'}`}>{s}</span>
            {idx < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${idx < step ? 'bg-emerald-400' : 'bg-navy-100'}`} />}
          </div>
        ))}
      </div>

      <div className="card mt-6">
        {step === 0 && (
          <div>
            <h2 className="text-base font-semibold text-navy-900">Select a category</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map(c => {
                const Icon = c.icon;
                const active = category === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setCategory(c.name)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${active ? 'border-navy-900 bg-navy-50 ring-2 ring-navy-200' : 'border-navy-100 hover:bg-navy-50'}`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}><Icon size={20} /></div>
                    <span className="text-xs font-semibold text-navy-800">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold text-navy-900">Add a photo</h2>
            <p className="mt-1 text-sm text-navy-400">A photo helps the team verify and resolve the issue faster.</p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-8 text-center transition hover:bg-navy-50">
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImage} />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-xl object-cover" />
              ) : (
                <>
                  <Camera size={32} className="text-navy-400" />
                  <p className="text-sm font-medium text-navy-600">Tap to capture or upload</p>
                  <p className="text-xs text-navy-400">JPG, PNG up to 5MB</p>
                </>
              )}
            </label>
            {imagePreview && (
              <button onClick={() => setImagePreview(null)} className="mt-2 text-xs font-semibold text-red-500 hover:text-red-700">Remove photo</button>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold text-navy-900">Select location</h2>
            <p className="mt-1 text-sm text-navy-400">Where is the issue located?</p>
            <div className="mt-4">
              <label className="label">Location / Landmark</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3.5 text-navy-400" />
                <input className="input pl-9" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Near Sitabuldi Flyover, Nagpur" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Sitabuldi', 'Dhantoli', 'Sadar', 'Civil Lines', 'Wardha Road'].map(l => (
                  <button key={l} onClick={() => setLocation(l)} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600 hover:bg-navy-100">{l}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-navy-900">Describe the issue</h2>
            <p className="mt-1 text-sm text-navy-400">Provide details so the team can take action.</p>
            <div className="mt-4">
              <label className="label">Description</label>
              <textarea className="input min-h-[120px] resize-none" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue, how long it's been there, and any safety concerns..." />
              <p className="mt-1 text-xs text-navy-400">{description.length} characters</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold text-navy-900">Review and submit</h2>
            <div className="mt-4 space-y-3">
              <ReviewRow icon={Trash2} label="Category" value={category ?? '—'} />
              <ReviewRow icon={MapPin} label="Location" value={location || '—'} />
              <ReviewRow icon={FileText} label="Description" value={description || '—'} />
              {imagePreview && <ReviewRow icon={Camera} label="Photo" value="Attached" />}
            </div>
          </div>
        )}

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-ghost">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <span />}

          {step < steps.length - 1 ? (
            <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()} className="btn-primary">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={submit} disabled={busy} className="btn-primary">
              {busy ? 'Submitting...' : 'Submit Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ icon: Icon, label, value }: { icon: typeof Trash2; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-navy-50/60 p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-navy-600"><Icon size={16} /></div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-navy-400">{label}</p>
        <p className="text-sm font-semibold text-navy-900">{value}</p>
      </div>
    </div>
  );
}
