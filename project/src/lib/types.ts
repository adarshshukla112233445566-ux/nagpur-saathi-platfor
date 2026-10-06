export type ComplaintCategory =
  | 'Garbage' | 'Pothole' | 'Streetlight' | 'Road Damage' | 'Water' | 'Drainage' | 'Other';

export type ComplaintStatus = 'Reported' | 'Verified' | 'Assigned' | 'In Progress' | 'Resolved';
export type RescueStatus = 'Reported' | 'Assigned' | 'Rescue in Progress' | 'Resolved';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Complaint {
  id: string;
  complaint_id: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  image_url?: string | null;
  status: ComplaintStatus;
  priority: Priority;
  created_by?: string | null;
  created_at: string;
}

export interface Rescue {
  id: string;
  rescue_id: string;
  animal_type: string;
  location: string;
  condition: string;
  description: string;
  image_url?: string | null;
  status: RescueStatus;
  created_by?: string | null;
  created_at: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  created_at: string;
}

export interface SavedPlace {
  id: string;
  place_id: string;
  created_at: string;
}

export interface DemoUser {
  name: string;
  email: string;
  mobile: string;
  role: 'citizen' | 'admin';
}

export const COMPLAINT_TIMELINE: ComplaintStatus[] = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
export const RESCUE_TIMELINE: RescueStatus[] = ['Reported', 'Assigned', 'Rescue in Progress', 'Resolved'];
