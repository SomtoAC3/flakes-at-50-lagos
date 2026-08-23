-- Guest profile photos: uploaded to the public gallery bucket under
-- avatars/, with the current file's path stored on the guest row.

alter table public.guests add column if not exists avatar_path text;

-- Expose the photo in the directory (still no contact info).
create or replace view public.guest_directory as
  select id, full_name as name, relationship, location, directory_message as message, avatar_path
  from public.guests
  where directory_opt_in = true and rsvp_status = 'attending';
