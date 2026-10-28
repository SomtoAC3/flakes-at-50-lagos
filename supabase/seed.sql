-- Seed data for local development. Safe to re-run: seed.sql runs fresh on
-- every `supabase db reset`. The Lagos itinerary and dress codes aren't
-- confirmed yet, so organizers add them from the admin dashboard.

insert into public.announcements (category, priority, message, created_at) values
  ('General', 'normal', $t$Welcome to the app! Complete your profile in My Trip, and keep an eye on the Itinerary for the Lagos schedule.$t$, now())
on conflict do nothing;
