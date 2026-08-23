-- Web push subscriptions + branding storage (app icon uploaded from admin).
--
-- Announcements are public (no login), so push subscriptions are accepted
-- from anonymous visitors too. Endpoints are unguessable push-service URLs;
-- rows are only ever read back by the send-push Edge Function using the
-- service role key, never by clients.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "anyone can register a subscription" on public.push_subscriptions;
create policy "anyone can register a subscription" on public.push_subscriptions
  for insert to anon, authenticated with check (true);

-- Re-subscribing after the push service rotates keys updates the same endpoint.
drop policy if exists "anyone can refresh their subscription" on public.push_subscriptions;
create policy "anyone can refresh their subscription" on public.push_subscriptions
  for update to anon, authenticated using (true) with check (true);

-- Turning notifications off deletes by endpoint, which only that browser knows.
drop policy if exists "anyone can remove their subscription" on public.push_subscriptions;
create policy "anyone can remove their subscription" on public.push_subscriptions
  for delete to anon, authenticated using (true);

-- No select policy: clients can never enumerate subscriptions.

-- ---------------------------------------------------------------------------
-- Branding bucket — fixed paths for the PWA icon, overwritten from the admin
-- Settings page: app-icon-512.png, app-icon-192.png, apple-touch-icon.png.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

drop policy if exists "organizers manage branding objects" on storage.objects;
create policy "organizers manage branding objects"
  on storage.objects for all to authenticated
  using (bucket_id = 'branding' and public.is_organizer())
  with check (bucket_id = 'branding' and public.is_organizer());
