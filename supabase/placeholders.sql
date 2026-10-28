-- Placeholder activities, so each day page shows what a fuller schedule
-- looks like. Every one has an id starting "ph-": edit or delete them in
-- admin Itinerary, or remove them all at once with
--   delete from public.itinerary_activities where id like 'ph-%' returning id, name;
-- Safe to re-run.

insert into public.itinerary_activities
  (id, day_id, name, start_time, end_time, location, meeting_point, departure_time, dress_code, what_to_bring, transport, description, notes, maps_query, sort_order)
select * from (values
  ('ph-d1-a2', (select id from public.itinerary_days where date = '2026-11-04'),
   'Welcome Drinks', '6:00 PM', '8:00 PM', 'Venue to be confirmed', 'Hotel lobby', '5:45 PM',
   'Smart Casual', null, 'Shuttle from the hotel',
   'Placeholder: a relaxed first evening together. The host team will add the details.',
   null, null, 2),

  ('ph-d2-a3', (select id from public.itinerary_days where date = '2026-11-05'),
   'Reception & Dinner', '6:00 PM', '9:00 PM', 'Venue to be confirmed', null, null,
   'High Fashion Meets Couture', null, null,
   'Placeholder: dinner after the service. The host team will add the details.',
   null, null, 3),

  ('ph-d3-a2', (select id from public.itinerary_days where date = '2026-11-06'),
   'Lunch by the Water', '1:00 PM', '3:00 PM', 'YOLO Beach', null, null,
   null, null, null,
   'Placeholder: lunch on the beach. The host team will add the details.',
   null, null, 2),
  ('ph-d3-a3', (select id from public.itinerary_days where date = '2026-11-06'),
   'Sunset & Return', '5:30 PM', null, 'YOLO Beach', 'Beach jetty', '6:00 PM',
   null, null, 'Boat back to Bics Garden',
   'Placeholder: watch the sun go down before heading back. The host team will add the details.',
   null, null, 3),

  ('ph-d4-a3', (select id from public.itinerary_days where date = '2026-11-07'),
   'Afternoon at Leisure', '12:00 PM', '5:00 PM', 'Lekki Phase 1', null, null,
   null, null, null,
   'Placeholder: free time to rest, shop or explore before the night. The host team will add the details.',
   null, null, 3),

  ('ph-d5-a2', (select id from public.itinerary_days where date = '2026-11-08'),
   'Farewell Brunch', '12:30 PM', '2:30 PM', 'Venue to be confirmed', null, null,
   null, null, null,
   'Placeholder: one last meal together. The host team will add the details.',
   null, null, 2),
  ('ph-d5-a3', (select id from public.itinerary_days where date = '2026-11-08'),
   'Departures', 'Afternoon', null, 'Joneer Court, Lekki Phase 1', null, null,
   null, null, 'Airport drop-offs',
   'Placeholder: safe travels home. The host team will add the details.',
   null, null, 3)
) as v(id, day_id, name, start_time, end_time, location, meeting_point, departure_time, dress_code, what_to_bring, transport, description, notes, maps_query, sort_order)
on conflict (id) do nothing;
