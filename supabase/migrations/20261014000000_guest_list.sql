-- Invite-only guest access.
--
-- guest_invites is the guest list organizers maintain from Admin → Guests.
-- 1. A "before user created" auth hook refuses sign-ups from emails that
--    aren't on it, so no sign-in code is ever emailed to them.
-- 2. Trip content is readable only by invited guests (and organizers), so
--    removing someone from the list cuts off their access immediately.

create table if not exists public.guest_invites (
  email text primary key check (email = lower(trim(email)) and email <> ''),
  added_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.guest_invites enable row level security;

-- Organizers are always on the list.
insert into public.guest_invites (email)
select lower(trim(email)) from public.guests where is_organizer and email is not null
on conflict (email) do nothing;

create or replace function public.is_invited()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_organizer() or exists (
    select 1 from public.guest_invites i
    where i.email = lower(auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_invited() from public;
grant execute on function public.is_invited() to anon, authenticated;

drop policy if exists "guests read own invite" on public.guest_invites;
create policy "guests read own invite" on public.guest_invites
  for select to authenticated
  using (email = lower(auth.jwt() ->> 'email'));

drop policy if exists "organizers manage invites" on public.guest_invites;
create policy "organizers manage invites" on public.guest_invites
  for all to authenticated
  using (public.is_organizer())
  with check (public.is_organizer());

grant select, insert, delete on public.guest_invites to authenticated;

-- Auth hook: runs before Supabase creates a new user (first sign-in).
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.guest_invites
    where email = lower(trim(event -> 'user' ->> 'email'))
  ) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'This email isn''t on the guest list. Contact the organizers.'
    )
  );
end;
$$;

revoke all on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;

-- Trip content: invited guests only (was: anyone).
drop policy if exists "itinerary days are public" on public.itinerary_days;
create policy "invited guests read itinerary days" on public.itinerary_days
  for select to authenticated using (public.is_invited());

drop policy if exists "itinerary activities are public" on public.itinerary_activities;
create policy "invited guests read itinerary activities" on public.itinerary_activities
  for select to authenticated using (public.is_invited());

drop policy if exists "dress codes are public" on public.dress_codes;
create policy "invited guests read dress codes" on public.dress_codes
  for select to authenticated using (public.is_invited());

drop policy if exists "announcements are public" on public.announcements;
create policy "invited guests read announcements" on public.announcements
  for select to authenticated using (public.is_invited());

drop policy if exists "site content is public" on public.site_content;
create policy "invited guests read site content" on public.site_content
  for select to authenticated using (public.is_invited());

drop policy if exists "guests read approved uploads" on public.gallery_uploads;
create policy "guests read approved uploads" on public.gallery_uploads
  for select to authenticated
  using (public.is_invited() and (status = 'approved' or guest_id = auth.uid()));

revoke select on public.itinerary_days, public.itinerary_activities, public.dress_codes,
  public.announcements, public.site_content from anon;

-- The directory view runs with its owner's rights, so filter it explicitly.
create or replace view public.guest_directory as
  select id, full_name as name, relationship, location, directory_message as message, avatar_path
  from public.guests
  where directory_opt_in = true and rsvp_status = 'attending' and public.is_invited();
