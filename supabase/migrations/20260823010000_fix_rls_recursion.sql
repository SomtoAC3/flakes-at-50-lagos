-- Fixes infinite recursion in RLS: the "organizers can see/manage everything"
-- policies checked is_organizer by querying public.guests from *within* a
-- policy defined on public.guests itself, which re-triggers that same
-- policy, forever (Postgres error 42P17). A SECURITY DEFINER function reads
-- guests with elevated privileges, bypassing RLS for that one lookup, which
-- breaks the recursive dependency.

create or replace function public.is_organizer()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select g.is_organizer from public.guests g where g.id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_organizer() from public;
grant execute on function public.is_organizer() to anon, authenticated;

-- guests
drop policy if exists "organizers read all profiles" on public.guests;
create policy "organizers read all profiles" on public.guests
  for select using (public.is_organizer());

drop policy if exists "organizers update all profiles" on public.guests;
create policy "organizers update all profiles" on public.guests
  for update using (public.is_organizer());

-- itinerary
drop policy if exists "organizers manage itinerary days" on public.itinerary_days;
create policy "organizers manage itinerary days" on public.itinerary_days
  for all using (public.is_organizer());

drop policy if exists "organizers manage itinerary activities" on public.itinerary_activities;
create policy "organizers manage itinerary activities" on public.itinerary_activities
  for all using (public.is_organizer());

-- dress codes
drop policy if exists "organizers manage dress codes" on public.dress_codes;
create policy "organizers manage dress codes" on public.dress_codes
  for all using (public.is_organizer());

-- announcements
drop policy if exists "organizers manage announcements" on public.announcements;
create policy "organizers manage announcements" on public.announcements
  for all using (public.is_organizer());

-- gallery
drop policy if exists "organizers manage all uploads" on public.gallery_uploads;
create policy "organizers manage all uploads" on public.gallery_uploads
  for all using (public.is_organizer());

drop policy if exists "organizers can delete gallery bucket objects" on storage.objects;
create policy "organizers can delete gallery bucket objects"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.is_organizer());
