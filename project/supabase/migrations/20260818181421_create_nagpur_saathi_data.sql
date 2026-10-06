/*
# Create Nagpur Saathi shared civic data

1. New Tables
- `nagpur_complaints`: citizen issue reports with category, location, description, status, priority, and optional image reference.
- `nagpur_rescues`: injured animal reports with animal details, location, condition, description, status, and optional image reference.
- `nagpur_saved_places`: saved destination IDs for the demo profile.
- `nagpur_notifications`: app notifications with read state and timestamps.

2. Security
- Row level security is enabled on every table.
- The demo app intentionally uses shared, non-sensitive civic records so both citizen and demo admin views can work through the browser client.
- Separate CRUD policies are provided for anonymous and authenticated demo sessions.

3. Important notes
- No passwords or private profile details are stored in these tables.
- Status changes are durable and visible to the citizen tracking view.
*/

CREATE TABLE IF NOT EXISTS nagpur_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id text UNIQUE NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'Reported',
  priority text NOT NULL DEFAULT 'Medium',
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nagpur_rescues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rescue_id text UNIQUE NOT NULL,
  animal_type text NOT NULL,
  location text NOT NULL,
  condition text NOT NULL,
  description text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'Reported',
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nagpur_saved_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nagpur_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nagpur_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE nagpur_rescues ENABLE ROW LEVEL SECURITY;
ALTER TABLE nagpur_saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE nagpur_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo read complaints" ON nagpur_complaints;
DROP POLICY IF EXISTS "demo insert complaints" ON nagpur_complaints;
DROP POLICY IF EXISTS "demo update complaints" ON nagpur_complaints;
DROP POLICY IF EXISTS "demo delete complaints" ON nagpur_complaints;
CREATE POLICY "demo read complaints" ON nagpur_complaints FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "demo insert complaints" ON nagpur_complaints FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "demo update complaints" ON nagpur_complaints FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo delete complaints" ON nagpur_complaints FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "demo read rescues" ON nagpur_rescues;
DROP POLICY IF EXISTS "demo insert rescues" ON nagpur_rescues;
DROP POLICY IF EXISTS "demo update rescues" ON nagpur_rescues;
DROP POLICY IF EXISTS "demo delete rescues" ON nagpur_rescues;
CREATE POLICY "demo read rescues" ON nagpur_rescues FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "demo insert rescues" ON nagpur_rescues FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "demo update rescues" ON nagpur_rescues FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo delete rescues" ON nagpur_rescues FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "demo read saved places" ON nagpur_saved_places;
DROP POLICY IF EXISTS "demo insert saved places" ON nagpur_saved_places;
DROP POLICY IF EXISTS "demo update saved places" ON nagpur_saved_places;
DROP POLICY IF EXISTS "demo delete saved places" ON nagpur_saved_places;
CREATE POLICY "demo read saved places" ON nagpur_saved_places FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "demo insert saved places" ON nagpur_saved_places FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "demo update saved places" ON nagpur_saved_places FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo delete saved places" ON nagpur_saved_places FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "demo read notifications" ON nagpur_notifications;
DROP POLICY IF EXISTS "demo insert notifications" ON nagpur_notifications;
DROP POLICY IF EXISTS "demo update notifications" ON nagpur_notifications;
DROP POLICY IF EXISTS "demo delete notifications" ON nagpur_notifications;
CREATE POLICY "demo read notifications" ON nagpur_notifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "demo insert notifications" ON nagpur_notifications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "demo update notifications" ON nagpur_notifications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo delete notifications" ON nagpur_notifications FOR DELETE TO anon, authenticated USING (true);