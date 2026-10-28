-- Lagos Edition content, from the "Flakes @ 50" itinerary guide and invites.
-- Safe to re-run: existing rows are left alone, so edits made from the admin
-- dashboard win. Applied to production once with
-- `npx supabase db query --linked -f supabase/seed.sql`.

insert into public.itinerary_days (date, label, weekday, theme, city, sort_order) values
  ('2026-11-04', 'Day One',   'Wednesday', 'Welcome to Lagos',         'Lagos', 1),
  ('2026-11-05', 'Day Two',   'Thursday',  'Thanksgiving & Beauty',    'Lagos', 2),
  ('2026-11-06', 'Day Three', 'Friday',    'Beach Day',                'Lagos', 3),
  ('2026-11-07', 'Day Four',  'Saturday',  'From Morning to Night',    'Lagos', 4),
  ('2026-11-08', 'Day Five',  'Sunday',    'A Beautiful Close',        'Lagos', 5)
on conflict (date) do nothing;

insert into public.itinerary_activities
  (id, day_id, name, start_time, end_time, location, meeting_point, departure_time, dress_code, what_to_bring, transport, description, notes, maps_query, sort_order)
select * from (values
  ('d1-a1', (select id from public.itinerary_days where date = '2026-11-04'),
   'Arrival & Check-in', 'Time TBC', null, 'Joneer Court, 15 Admiralty Way, Lekki Phase 1', null, null,
   null, null, null,
   'Settle in, ease into the weekend, and get ready for a beautiful few days of celebration.',
   'A relaxed arrival, a beautiful service, beachside ease, and a celebratory night out — all thoughtfully paced for a memorable Lagos weekend.',
   'Joneer Court, 15 Admiralty Way, Lekki Phase 1, Lagos', 1),

  ('d2-a1', (select id from public.itinerary_days where date = '2026-11-05'),
   'Glam & Getting Ready', 'Morning', null, 'Lekki Phase 1', null, null,
   null, null, null,
   'Recommended places to get your makeup done before the service: Glam by Tola, Beauty by Tejj Studio, House of Tara and Beautiebycassie.',
   'Addresses and phone numbers are under Makeup Appointments in Travel Information. Book ahead.',
   null, 1),
  ('d2-a2', (select id from public.itinerary_days where date = '2026-11-05'),
   'Thanksgiving Service: Fí Ọlá Kẹ – Blossomed in Grace', '2:00 PM', '5:00 PM',
   $t$RCCG The King's Court, 3 Keystone Bank Crescent, Victoria Island$t$, null, null,
   'High Fashion Meets Couture', null, null,
   $t$Folake Soetan's 50th — as she returns all the glory to Almighty God. Grace looks good on you.$t$,
   'Allow extra time for traffic between Lekki and Victoria Island.',
   $t$RCCG The King's Court, 3 Keystone Bank Crescent, Victoria Island, Lagos$t$, 2),

  ('d3-a1', (select id from public.itinerary_days where date = '2026-11-06'),
   'Beach Day at YOLO Beach', '10:00 AM', null, 'YOLO Beach', 'Bics Garden', '10:00 AM, 11:00 AM or 12:00 PM',
   'All White', 'Sunscreen, sunglasses, swimwear', null,
   'Sun, sea, good company, and an easy Lagos rhythm. Kimonos will also be provided.',
   'Three departures from Bics Garden: 10:00 AM, 11:00 AM and 12:00 PM. Pick the one that suits you.',
   'Bics Garden, Lagos', 1),

  ('d4-a1', (select id from public.itinerary_days where date = '2026-11-07'),
   'Morning Breakfast', 'Morning', null, 'Venue to be confirmed', null, null,
   null, null, null,
   'A day of good company, great food and unforgettable nights starts with breakfast together.',
   'Breakfast venue to be confirmed. Details will be shared in Announcements.',
   null, 1),
  ('d4-a2', (select id from public.itinerary_days where date = '2026-11-07'),
   'Flakes Unscripted at District F', '6:00 PM', null, 'The Jewel Aeida, Lekki Phase 1', null, null,
   'Club Aesthetics. High Fashion.', null, null,
   'Good food, good music, good energy. Good people, better nights.',
   null,
   'The Jewel Aeida, Lekki Phase 1, Lagos', 2),

  ('d5-a1', (select id from public.itinerary_days where date = '2026-11-08'),
   'Church Thanksgiving (Optional)', 'Time TBC', null, 'Venue to be confirmed', null, null,
   null, null, null,
   'A gentle close to the celebration weekend, giving thanks for 50 years of grace, life, and love.',
   'Optional. More details will be shared by the host team.',
   null, 1)
) as v(id, day_id, name, start_time, end_time, location, meeting_point, departure_time, dress_code, what_to_bring, transport, description, notes, maps_query, sort_order)
on conflict (id) do nothing;

insert into public.dress_codes (id, event, date, title, palette, description, inspiration, footwear, avoid, weather, sort_order) values
  ('thanksgiving', 'Thanksgiving Service', 'November 5', 'High Fashion Meets Couture',
   array['#7B1E2B','#C1121F','#B5176A','#1F2A44','#0B6E4F','#D4A017','#F2C4CE','#F3EBDA','#6B4226'],
   'Grace looks good on you. For her: statement hats, bold colours, monochrome and elegant silhouettes. For him: sharp tailoring, elevated native wear and modern sophistication.',
   'Burgundy, red, magenta, navy, emerald green, mustard yellow, blush pink, cream and brown',
   null, null, null, 1),
  ('beach', 'Beach Day', 'November 6', 'All White',
   array['#FFFFFF','#F3EBDA'],
   'Head-to-toe white for a day by the sea. Kimonos will also be provided.',
   'Breezy linen, crochet, wide-brim straw hats', 'Sandals or slides', null, 'Warm and sunny by the water', 2),
  ('unscripted', 'Flakes Unscripted', 'November 7', 'Club Aesthetics. High Fashion.',
   array['#0B0B0C','#5A0F1E','#B76E79','#D4AF37'],
   'Dressed for the club, styled for the runway. Good food, good music, good energy.',
   'After-dark glamour: sleek blacks, rose gold, deep burgundy, a little sparkle',
   null, null, null, 3)
on conflict (id) do nothing;

insert into public.site_content (key, value) values
  ('welcome_note', E'Dear Guests,\n\nThe countdown to 50 continues in Lagos. Thank you for showing up with love for Flakes. From arrival and thanksgiving to beachside ease and a night out together, this weekend is a celebration of grace, life and friendship. Here''s to beautiful people and meaningful moments. See you in Lagos.')
on conflict (key) do update set value = excluded.value
  where public.site_content.value like 'Fifty years, and I still can''t believe%';

insert into public.announcements (category, priority, message, created_at)
select 'General', 'normal', $t$Welcome to Flakes@50 Lagos Edition! The full weekend, 4–8 November, is in the Itinerary. Complete your profile in My Trip so the team knows you're coming.$t$, now()
where not exists (select 1 from public.announcements);
