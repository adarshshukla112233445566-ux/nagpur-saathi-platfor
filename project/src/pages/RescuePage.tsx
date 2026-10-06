import { useState } from 'react';
import type { Route } from '@/lib/router';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/lib/auth';
import { createRescue, createNotification } from '@/lib/data';
import { ArrowLeft, Dog, Camera, MapPin, FileText, Check } from 'lucide-react';

const animalTypes = ['Dog', 'Cat', 'Cow', 'Bird', 'Monkey', 'Other'];
const conditions = ['Injured', 'Sick', 'Trapped', 'Aggressive', 'Abandoned'];

export function RescuePage({ navigate }: { navigate: (r: Route, p?: Record<string, string>) => void }) {
  const { show } = useToast();
  const { user } = useAuth();
  const [animalType, setAnimalType] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!animalType || !condition || !location.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setBusy(true);
    try {
      const rescue = await createRescue({
        animal_type: animalType,
        location: location.trim(),
        condition,
        description: description.trim(),
        image_url: imagePreview,
        created_by: user?.email ?? null,
      });
      await createNotification(
        `Rescue ${rescue.rescue_id} reported`,
        `Your ${animalType} rescue report has been received and is being reviewed.`,
      );
      show(`Rescue ${rescue.rescue_id} reported successfully!`);
      navigate('report-detail', { id: rescue.rescue_id });
    } catch {
      setError('Unable to submit your rescue report. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-900">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Dog size={22} /></div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Report Injured Animal</h1>
          <p className="text-sm text-navy-400">Help Nagpur's street animals get rescue support.</p>
        </div>
      </div>

      <form onSubmit={submit} className="card mt-5 space-y-4">
        <div>
          <label className="label">Animal Type</label>
          <div className="flex flex-wrap gap-2">
            {animalTypes.map(t => (
              <button key={t} type="button" onClick={() => setAnimalType(t)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${animalType === t ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Condition</label>
          <div className="flex flex-wrap gap-2">
            {conditions.map(c => (
              <button key={c} type="button" onClick={() => setCondition(c)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${condition === c ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Photo</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-6 text-center transition hover:bg-navy-50">
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImage} />
            {imagePreview ? <img src={imagePreview} alt="Preview" className="max-h-40 rounded-xl object-cover" /> : (
              <>
                <Camera size={28} className="text-navy-400" />
                <p className="text-sm font-medium text-navy-600">Tap to capture or upload</p>
              </>
            )}
          </label>
        </div>

        <div>
          <label className="label">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3 text-navy-400" />
            <input className="input pl-9" value={location} onChange={e => setLocation(e.target.value)} placeholder="Where is the animal located?" />
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px] resize-none" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the animal's condition and any immediate danger..." />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Submitting...' : 'Submit Rescue Report'}
        </button>
      </form>
    </div>
  );
}
