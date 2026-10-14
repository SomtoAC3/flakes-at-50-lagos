-- The guest site is public again: trip info is readable without signing in.
-- Only the admin portal, and the guest pages that touch personal data
-- (My Trip, directory, gallery), still need sign-in. The guest list and the
-- before-user-created hook stay, so only listed emails can sign in.

drop policy if exists "invited guests read itinerary days" on public.itinerary_days;
drop policy if exists "itinerary days are public" on public.itinerary_days;
create policy "itinerary days are public" on public.itinerary_days
  for select using (true);

drop policy if exists "invited guests read itinerary activities" on public.itinerary_activities;
drop policy if exists "itinerary activities are public" on public.itinerary_activities;
create policy "itinerary activities are public" on public.itinerary_activities
  for select using (true);

drop policy if exists "invited guests read dress codes" on public.dress_codes;
drop policy if exists "dress codes are public" on public.dress_codes;
create policy "dress codes are public" on public.dress_codes
  for select using (true);

drop policy if exists "invited guests read announcements" on public.announcements;
drop policy if exists "announcements are public" on public.announcements;
create policy "announcements are public" on public.announcements
  for select using (true);

drop policy if exists "invited guests read site content" on public.site_content;
drop policy if exists "site content is public" on public.site_content;
create policy "site content is public" on public.site_content
  for select using (true);

grant select on public.itinerary_days, public.itinerary_activities, public.dress_codes,
  public.announcements, public.site_content to anon, authenticated;
