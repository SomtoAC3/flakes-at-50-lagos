# Folake at 50 — The Egypt Takeover

A trip-companion app for a five-day 50th birthday celebration across Cairo
and the Red Sea (Oct 28 – Nov 1, 2026): itinerary, dress codes, travel info,
guest profiles/RSVP, a guest directory, announcements, a photo gallery, and
an organizer admin dashboard.

This started as a Claude-generated prototype (single-file React component
with mock data) and has been scaffolded here into a real Vite + React +
Tailwind project, ready to wire up to Supabase.

## Stack

- **Vite + React** — app shell and build tooling
- **Tailwind CSS v4** — styling (utility classes + inline design tokens)
- **lucide-react** — icons
- **Supabase** — planned backend for auth, database, and file storage (see
  below — not yet connected)

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  App.jsx              # all screens/components (ported from the prototype)
  lib/
    supabaseClient.js  # Supabase client — falls back to mock data if unset
  index.css            # Tailwind entrypoint + font imports
supabase/
  schema.sql           # tables, RLS policies for a Supabase project
.env.example            # copy to .env once you have a Supabase project
```

`App.jsx` currently still uses the prototype's in-memory mock data
(`ITINERARY`, `ANNOUNCEMENTS`, `DRESS_CODES`, etc.) and local component
state for forms (My Trip, Admin login). That's intentional for this first
pass — the structure below is ready for those to be swapped for live
Supabase queries screen by screen.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` — it creates the guests,
   itinerary, dress codes, announcements, and gallery tables with row-level
   security policies (guests see their own data + public itinerary/dress
   code/announcement content; organizers — guests with `is_organizer = true`
   — see everything).
3. Create a public Storage bucket named `gallery` for photo/video uploads.
4. Copy `.env.example` to `.env` and fill in your project's URL and anon key
   (Project Settings → API).
5. Swap the mock-data screens over to Supabase queries one at a time,
   starting with whichever matters most first — My Trip (RSVP) and
   Announcements are good candidates since they're the most "live" parts of
   the app.

Until `.env` is filled in, `isSupabaseConfigured` (from
`src/lib/supabaseClient.js`) is `false` and the app keeps running on mock
data, so the front end stays usable while the backend comes online.

## Design

The visual design (obsidian/ivory/gold/emerald palette, Fraunces + Inter +
IBM Plex Mono type system, the "cartouche countdown" and lintel-divider
motifs) lives directly in `App.jsx` as inline style objects plus Tailwind
utility classes. A companion Claude Design canvas mirrors the key screens
for visual iteration without touching code — ask for its link if you don't
have it.
