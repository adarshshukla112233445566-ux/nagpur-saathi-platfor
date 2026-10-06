import { supabase } from './supabase';
import type { Complaint, Rescue, AppNotification, SavedPlace, ComplaintStatus, RescueStatus, Priority } from './types';

const FALLBACK_KEY = 'nagpur_saathi_fallback_v1';

interface FallbackDB {
  complaints: Complaint[];
  rescues: Rescue[];
  notifications: AppNotification[];
  savedPlaces: SavedPlace[];
}

function readFallback(): FallbackDB {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    if (raw) return JSON.parse(raw) as FallbackDB;
  } catch {}
  return { complaints: [], rescues: [], notifications: [], savedPlaces: [] };
}

function writeFallback(db: FallbackDB) {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(db)); } catch {}
}

export function isSupabaseReady(): boolean {
  return supabase !== null;
}

function genId(prefix: string, seq: number, pad = 5): string {
  return `${prefix}-2026-${String(seq).padStart(pad, '0')}`;
}

export async function nextComplaintId(): Promise<string> {
  const count = await countComplaints();
  return genId('NS', count + 124);
}

export async function nextRescueId(): Promise<string> {
  const count = await countRescues();
  return genId('RES', count + 81, 4);
}

async function countComplaints(): Promise<number> {
  if (supabase) {
    const { count } = await supabase.from('nagpur_complaints').select('*', { count: 'exact', head: true });
    if (count !== null && count !== undefined) return count;
  }
  return readFallback().complaints.length;
}

async function countRescues(): Promise<number> {
  if (supabase) {
    const { count } = await supabase.from('nagpur_rescues').select('*', { count: 'exact', head: true });
    if (count !== null && count !== undefined) return count;
  }
  return readFallback().rescues.length;
}

export async function createComplaint(input: Omit<Complaint, 'id' | 'complaint_id' | 'status' | 'priority' | 'created_at'> & { priority?: Priority }): Promise<Complaint> {
  const complaint_id = await nextComplaintId();
  const record: Complaint = {
    id: crypto.randomUUID(),
    complaint_id,
    status: 'Reported',
    priority: input.priority ?? 'Medium',
    created_at: new Date().toISOString(),
    ...input,
  };
  if (supabase) {
    const { data, error } = await supabase.from('nagpur_complaints').insert({
      complaint_id: record.complaint_id,
      category: record.category,
      location: record.location,
      description: record.description,
      image_url: record.image_url,
      status: record.status,
      priority: record.priority,
      created_by: record.created_by,
    }).select('*').single();
    if (!error && data) return mapComplaint(data);
  }
  const db = readFallback();
  db.complaints.unshift(record);
  writeFallback(db);
  return record;
}

export async function listComplaints(): Promise<Complaint[]> {
  if (supabase) {
    const { data, error } = await supabase.from('nagpur_complaints').select('*').order('created_at', { ascending: false });
    if (!error && data) return data.map(mapComplaint);
  }
  return readFallback().complaints;
}

export async function updateComplaintStatus(complaint_id: string, status: ComplaintStatus, priority?: Priority): Promise<void> {
  if (supabase) {
    const update: Record<string, string> = { status };
    if (priority) update.priority = priority;
    const { error } = await supabase.from('nagpur_complaints').update(update).eq('complaint_id', complaint_id);
    if (!error) return;
  }
  const db = readFallback();
  const c = db.complaints.find(x => x.complaint_id === complaint_id);
  if (c) { c.status = status; if (priority) c.priority = priority; writeFallback(db); }
}

export async function createRescue(input: Omit<Rescue, 'id' | 'rescue_id' | 'status' | 'created_at'>): Promise<Rescue> {
  const rescue_id = await nextRescueId();
  const record: Rescue = {
    id: crypto.randomUUID(),
    rescue_id,
    status: 'Reported',
    created_at: new Date().toISOString(),
    ...input,
  };
  if (supabase) {
    const { data, error } = await supabase.from('nagpur_rescues').insert({
      rescue_id: record.rescue_id,
      animal_type: record.animal_type,
      location: record.location,
      condition: record.condition,
      description: record.description,
      image_url: record.image_url,
      status: record.status,
      created_by: record.created_by,
    }).select('*').single();
    if (!error && data) return mapRescue(data);
  }
  const db = readFallback();
  db.rescues.unshift(record);
  writeFallback(db);
  return record;
}

export async function listRescues(): Promise<Rescue[]> {
  if (supabase) {
    const { data, error } = await supabase.from('nagpur_rescues').select('*').order('created_at', { ascending: false });
    if (!error && data) return data.map(mapRescue);
  }
  return readFallback().rescues;
}

export async function updateRescueStatus(rescue_id: string, status: RescueStatus): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('nagpur_rescues').update({ status }).eq('rescue_id', rescue_id);
    if (!error) return;
  }
  const db = readFallback();
  const r = db.rescues.find(x => x.rescue_id === rescue_id);
  if (r) { r.status = status; writeFallback(db); }
}

export async function listNotifications(): Promise<AppNotification[]> {
  if (supabase) {
    const { data, error } = await supabase.from('nagpur_notifications').select('*').order('created_at', { ascending: false });
    if (!error && data) return data.map(mapNotification);
  }
  return readFallback().notifications;
}

export async function createNotification(title: string, description: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('nagpur_notifications').insert({ title, description, read: false });
    if (!error) return;
  }
  const db = readFallback();
  db.notifications.unshift({
    id: crypto.randomUUID(),
    title, description, read: false, created_at: new Date().toISOString(),
  });
  writeFallback(db);
}

export async function markNotificationRead(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('nagpur_notifications').update({ read: true }).eq('id', id);
    if (!error) return;
  }
  const db = readFallback();
  const n = db.notifications.find(x => x.id === id);
  if (n) { n.read = true; writeFallback(db); }
}

export async function markAllNotificationsRead(): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('nagpur_notifications').update({ read: true }).eq('read', false);
    if (!error) return;
  }
  const db = readFallback();
  db.notifications.forEach(n => { n.read = true; });
  writeFallback(db);
}

export async function listSavedPlaces(): Promise<SavedPlace[]> {
  if (supabase) {
    const { data, error } = await supabase.from('nagpur_saved_places').select('*').order('created_at', { ascending: false });
    if (!error && data) return data.map(mapSavedPlace);
  }
  return readFallback().savedPlaces;
}

export async function savePlace(place_id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('nagpur_saved_places').upsert({ place_id }, { onConflict: 'place_id' });
    if (!error) return;
  }
  const db = readFallback();
  if (!db.savedPlaces.some(p => p.place_id === place_id)) {
    db.savedPlaces.unshift({ id: crypto.randomUUID(), place_id, created_at: new Date().toISOString() });
    writeFallback(db);
  }
}

export async function unsavePlace(place_id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('nagpur_saved_places').delete().eq('place_id', place_id);
    if (!error) return;
  }
  const db = readFallback();
  db.savedPlaces = db.savedPlaces.filter(p => p.place_id !== place_id);
  writeFallback(db);
}

function mapComplaint(row: Record<string, unknown>): Complaint {
  return {
    id: String(row.id),
    complaint_id: String(row.complaint_id),
    category: row.category as Complaint['category'],
    location: String(row.location),
    description: String(row.description),
    image_url: row.image_url as string | null,
    status: row.status as ComplaintStatus,
    priority: row.priority as Priority,
    created_by: row.created_by as string | null,
    created_at: String(row.created_at),
  };
}

function mapRescue(row: Record<string, unknown>): Rescue {
  return {
    id: String(row.id),
    rescue_id: String(row.rescue_id),
    animal_type: String(row.animal_type),
    location: String(row.location),
    condition: String(row.condition),
    description: String(row.description),
    image_url: row.image_url as string | null,
    status: row.status as RescueStatus,
    created_by: row.created_by as string | null,
    created_at: String(row.created_at),
  };
}

function mapNotification(row: Record<string, unknown>): AppNotification {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    read: Boolean(row.read),
    created_at: String(row.created_at),
  };
}

function mapSavedPlace(row: Record<string, unknown>): SavedPlace {
  return {
    id: String(row.id),
    place_id: String(row.place_id),
    created_at: String(row.created_at),
  };
}
