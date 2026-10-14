-- Anyone can sign in (for My Trip, the directory and photo uploads); the
-- guest list is gone. Approved gallery photos are public.

-- The before-user-created hook may still be switched on in the dashboard,
-- so keep the function but let every sign-up through.
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language sql
as $$ select '{}'::jsonb $$;

revoke all on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;

-- Gallery: approved photos for everyone, plus your own pending uploads.
drop policy if exists "guests read approved uploads" on public.gallery_uploads;
create policy "guests read approved uploads" on public.gallery_uploads
  for select using (status = 'approved' or guest_id = auth.uid());
grant select on public.gallery_uploads to anon;

-- Directory: any signed-in guest. The view runs with its owner's rights,
-- so filter explicitly.
create or replace view public.guest_directory as
  select id, full_name as name, relationship, location, directory_message as message, avatar_path
  from public.guests
  where directory_opt_in = true and rsvp_status = 'attending' and auth.uid() is not null;

drop function if exists public.is_invited();
drop table if exists public.guest_invites;
