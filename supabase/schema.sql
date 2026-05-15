-- Anonymous usage analytics for later-you-said.
-- Personal saved link/card content is NOT stored here; it stays on-device.

create table if not exists public.usage_events (
  id bigint generated always as identity primary key,
  anonymous_user_id text not null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_created_at_idx
  on public.usage_events (created_at desc);

create index if not exists usage_events_anonymous_user_id_idx
  on public.usage_events (anonymous_user_id);

create index if not exists usage_events_event_name_idx
  on public.usage_events (event_name);

alter table public.usage_events enable row level security;

-- The app only needs to insert anonymous events with the public anon key.
-- Reading analytics should happen from the Supabase dashboard or server-side tools.
drop policy if exists "allow anonymous event inserts" on public.usage_events;
create policy "allow anonymous event inserts"
  on public.usage_events
  for insert
  to anon
  with check (true);
