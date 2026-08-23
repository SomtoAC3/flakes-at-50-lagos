-- Folake at 50 — initial schema
--
-- Auth model: everyone (guests and organizers alike) signs in with a
-- Supabase Auth email magic link. A row is auto-created in public.guests
-- for every new auth.users row (see handle_new_user below). Organizers are
-- guests with is_organizer = true — set manually the first time
-- (`update public.guests set is_organizer = true where email = '...'`),
-- after which they can promote others from the admin dashboard.
--
-- Visibility model:
--   - itinerary, dress codes, announcements: readable by anyone (public
--     link, no login) — general trip info, not personal.
--   - guests (own row), guest_directory, announcement_reads, gallery
--     uploads: require a signed-in guest.
--   - writes to itinerary/dress codes/announcements, and reads across all
--     guests: organizers only, via RLS checking guests.is_organizer.

-- ---------------------------------------------------------------------------
-- Guests / "My Trip" profile
-- ---------------------------------------------------------------------------
create table if not exists public.guests (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  emergency_contact text,
  flight_arrival text,
  flight_departure text,
  travel_agent_status text default 'not-using' check (travel_agent_status in ('not-using', 'booked', 'pending')),
  hotel_arrangement text,
  roommate text,
  dietary text,
  allergies text,
  accessibility text,
  rsvp_status text default 'pending' check (rsvp_status in ('pending', 'attending', 'not-attending')),
  special_requests text,
  relationship text,          -- shown in Guest Directory, e.g. "Sister", "Best Friend"
  location text,               -- shown in Guest Directory, e.g. "Lagos, Nigeria"
  directory_message text,      -- optional public message shown in Guest Directory
  directory_opt_in boolean not null default true,
  is_organizer boolean not null default false,
  checklist jsonb not null default '{}'::jsonb, -- { rsvp: true, passport: true, ... }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guests enable row level security;

create policy "guests read own profile" on public.guests
  for select using (auth.uid() = id);
create policy "guests update own profile" on public.guests
  for update using (auth.uid() = id);
create policy "guests insert own profile" on public.guests
  for insert with check (auth.uid() = id);

create policy "organizers read all profiles" on public.guests
  for select using (
    exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );
create policy "organizers update all profiles" on public.guests
  for update using (
    exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );

-- Auto-create a guests row whenever someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.guests (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on public.guests;
create trigger guests_set_updated_at
  before update on public.guests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Guest Directory (public-safe view — no contact info, respects opt-in)
-- ---------------------------------------------------------------------------
create or replace view public.guest_directory as
  select id, full_name as name, relationship, location, directory_message as message
  from public.guests
  where directory_opt_in = true and rsvp_status = 'attending';

-- ---------------------------------------------------------------------------
-- Itinerary (public read; organizer write)
-- ---------------------------------------------------------------------------
create table if not exists public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  label text not null,
  weekday text not null,
  theme text not null,
  city text not null,
  sort_order int not null default 0
);

create table if not exists public.itinerary_activities (
  id text primary key,
  day_id uuid not null references public.itinerary_days (id) on delete cascade,
  name text not null,
  start_time text,
  end_time text,
  location text,
  meeting_point text,
  departure_time text,
  dress_code text,
  what_to_bring text,
  transport text,
  description text,
  notes text,
  maps_query text,
  sort_order int not null default 0
);

alter table public.itinerary_days enable row level security;
alter table public.itinerary_activities enable row level security;

create policy "itinerary days are public" on public.itinerary_days
  for select using (true);
create policy "itinerary activities are public" on public.itinerary_activities
  for select using (true);

create policy "organizers manage itinerary days" on public.itinerary_days
  for all using (
    exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );
create policy "organizers manage itinerary activities" on public.itinerary_activities
  for all using (
    exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );

-- ---------------------------------------------------------------------------
-- Dress codes (public read; organizer write)
-- ---------------------------------------------------------------------------
create table if not exists public.dress_codes (
  id text primary key,
  event text not null,
  date text not null,
  title text not null,
  palette text[] not null default '{}',
  description text,
  inspiration text,
  footwear text,
  avoid text,
  weather text,
  sort_order int not null default 0
);

alter table public.dress_codes enable row level security;
create policy "dress codes are public" on public.dress_codes
  for select using (true);
create policy "organizers manage dress codes" on public.dress_codes
  for all using (
    exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );

-- ---------------------------------------------------------------------------
-- Announcements (public read; organizer write; read receipts need login)
-- ---------------------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  priority text not null default 'normal' check (priority in ('normal', 'urgent')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.announcement_reads (
  announcement_id uuid not null references public.announcements (id) on delete cascade,
  guest_id uuid not null references public.guests (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (announcement_id, guest_id)
);

alter table public.announcements enable row level security;
alter table public.announcement_reads enable row level security;

create policy "announcements are public" on public.announcements
  for select using (true);
create policy "organizers manage announcements" on public.announcements
  for all using (
    exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );

create policy "guests manage their own read receipts" on public.announcement_reads
  for all using (auth.uid() = guest_id) with check (auth.uid() = guest_id);

-- ---------------------------------------------------------------------------
-- Gallery uploads (moderated — organizers approve before guests see them)
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_uploads (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references public.guests (id) on delete set null,
  storage_path text not null,
  category text,
  caption text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.gallery_uploads enable row level security;

create policy "guests read approved uploads" on public.gallery_uploads
  for select using (status = 'approved' or guest_id = auth.uid());
create policy "guests insert their own uploads" on public.gallery_uploads
  for insert with check (guest_id = auth.uid());
create policy "organizers manage all uploads" on public.gallery_uploads
  for all using (
    exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "authenticated users can upload to gallery bucket"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "organizers can delete gallery bucket objects"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'gallery'
    and exists (select 1 from public.guests g where g.id = auth.uid() and g.is_organizer)
  );

-- ---------------------------------------------------------------------------
-- Grants — the Data API only exposes what's explicitly granted, on top of
-- whatever RLS then allows.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.itinerary_days, public.itinerary_activities, public.dress_codes, public.announcements
  to anon, authenticated;

grant select, insert, update on public.guests to authenticated;
grant select on public.guest_directory to authenticated;
grant select, insert, update, delete on public.announcement_reads to authenticated;
grant select, insert on public.gallery_uploads to authenticated;
grant update on public.gallery_uploads to authenticated;
