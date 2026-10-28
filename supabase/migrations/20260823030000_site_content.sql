-- Editable site copy (welcome note, etc.) — public read, organizer write.

create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "site content is public" on public.site_content;
create policy "site content is public" on public.site_content
  for select using (true);

drop policy if exists "organizers manage site content" on public.site_content;
create policy "organizers manage site content" on public.site_content
  for all to authenticated
  using (public.is_organizer())
  with check (public.is_organizer());

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

insert into public.site_content (key, value) values
  ('welcome_note', 'Fifty years, and I still can''t believe I get to share this chapter with all of you — at home in Lagos. Pack your gold, bring your energy, and let''s make this a celebration for the books.')
on conflict (key) do nothing;
