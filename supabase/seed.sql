-- Seed data for local development — mirrors the content that used to be
-- hardcoded in the prototype's ITINERARY / DRESS_CODES constants, so the
-- app has real content to render from day one. Safe to re-run: seed.sql
-- runs fresh on every `supabase db reset`.

insert into public.itinerary_days (date, label, weekday, theme, city, sort_order) values
  ('2026-10-28', 'Day One',   'Wednesday', 'Arrival in Cairo',          'Cairo',   1),
  ('2026-10-29', 'Day Two',   'Thursday',  'Cairo, Reimagined',         'Cairo',   2),
  ('2026-10-30', 'Day Three', 'Friday',    'The All-White Boat Party',  'Cairo',   3),
  ('2026-10-31', 'Day Four',  'Saturday',  'To The Red Sea',            'Red Sea', 4),
  ('2026-11-01', 'Day Five',  'Sunday',    'The Birthday Finale',       'Red Sea', 5)
on conflict (date) do nothing;

insert into public.itinerary_activities
  (id, day_id, name, start_time, end_time, location, meeting_point, departure_time, dress_code, what_to_bring, transport, description, notes, maps_query, sort_order)
select * from (values
  ('d1-a1', (select id from public.itinerary_days where date = '2026-10-28'),
   'Arrivals & Welcome Reception', '3:00 PM', '7:00 PM', 'Hotel Lobby Lounge — To Be Confirmed', 'Hotel Lobby', '—',
   'Relaxed elegance — travel-friendly, resort casual', 'Passport, hotel confirmation, evening layer',
   'Private airport transfers arranged for guests on the group flight — details TBC',
   'Check in, settle into your room with a view, and unwind with the first faces of the celebration over signature Egyptian mocktails and light bites.',
   'Rooms may not be ready before 3:00 PM depending on flight arrival.', 'Cairo Hotel', 1),
  ('d1-a2', (select id from public.itinerary_days where date = '2026-10-28'),
   'Welcome Dinner Under the Stars', '8:00 PM', '10:30 PM', 'Rooftop Terrace — To Be Confirmed', 'Hotel Lobby, 7:45 PM', '7:45 PM',
   'Smart resort — golds, creams, and jewel tones encouraged', 'Light jacket for the evening breeze', 'On foot / in-hotel venue',
   $t$Folake's first toast of the trip — an intimate dinner overlooking the city skyline to kick off five days of celebration.$t$,
   'To Be Confirmed', 'Cairo Rooftop Restaurant', 2),

  ('d2-a1', (select id from public.itinerary_days where date = '2026-10-29'),
   'Pyramids of Giza & Sphinx Experience', '8:00 AM', '12:30 PM', 'Giza Plateau', 'Hotel Lobby', '7:30 AM',
   'Desert Chic — breathable fabrics, closed-toe shoes, sun hat', 'Sunscreen, sunglasses, water bottle, camera', 'Private coach — group departure',
   E'A guided journey through one of the Seven Wonders of the Ancient World, timed for golden morning light and cooler desert air.',
   'Early departure — breakfast boxes provided for those skipping the hotel buffet.', 'Pyramids of Giza', 1),
  ('d2-a2', (select id from public.itinerary_days where date = '2026-10-29'),
   'Nile Lunch Cruise', '1:30 PM', '3:30 PM', 'The Nile River', 'Hotel Lobby', '1:00 PM',
   'Resort casual', 'Camera', 'Private coach to dock, then private boat',
   $t$A leisurely lunch cruise along the Nile with panoramic views of Cairo's skyline.$t$,
   'To Be Confirmed', 'Nile River Cairo', 2),
  ('d2-a3', (select id from public.itinerary_days where date = '2026-10-29'),
   'Free Evening', '6:00 PM', '—', 'At leisure', '—', '—',
   'Your choice', '—', 'Not organized — arrange independently',
   $t$An open evening to rest, explore, or gather informally before tomorrow's celebration.$t$,
   'To Be Confirmed', '', 3),

  ('d3-a1', (select id from public.itinerary_days where date = '2026-10-30'),
   'Egyptian Museum Visit', '10:00 AM', '12:00 PM', 'The Grand Egyptian Museum — To Be Confirmed', 'Hotel Lobby', '9:30 AM',
   'Smart casual', 'Comfortable shoes', 'Private coach',
   $t$A curated walk through Egypt's treasures with a licensed guide.$t$,
   'To Be Confirmed', 'Grand Egyptian Museum', 1),
  ('d3-a2', (select id from public.itinerary_days where date = '2026-10-30'),
   'ALL WHITE TONIGHT — Boat Party', '8:00 PM', '1:00 AM', 'The Nile River', 'Hotel Lobby', '7:30 PM',
   'ALL WHITE — head-to-toe pure white only. Elegant, breezy, glamorous, and ready to float.', 'Dancing shoes, a small clutch, your best energy',
   'Private coach to dock, then chartered boat',
   $t$The signature night of the trip — Folake's floating celebration on the Nile, with music, dinner, and dancing under the stars.$t$,
   'Boat departs promptly at 8:30 PM — latecomers may miss boarding.', 'Nile River Cairo', 2),

  ('d4-a1', (select id from public.itinerary_days where date = '2026-10-31'),
   'Domestic Transfer: Cairo → Red Sea', '9:00 AM', '12:00 PM', 'Cairo Airport → Red Sea Resort', 'Hotel Lobby', '9:00 AM',
   'Comfortable travel wear', 'Packed luggage, travel documents', 'Domestic flight or coach — To Be Confirmed',
   'We say goodbye to Cairo and journey to the coast for the final leg of the celebration.',
   'Luggage tags will be provided — watch Announcements for pickup times.', '', 1),
  ('d4-a2', (select id from public.itinerary_days where date = '2026-10-31'),
   'Desert Chic Sunset Experience', '5:00 PM', '8:00 PM', 'Red Sea Desert — To Be Confirmed', 'Resort Lobby', '4:30 PM',
   'DESERT CHIC — luxury neutrals, flowing fabrics, earthy colors, comfortable footwear, elevated desert-inspired styling',
   'Scarf or wrap, sunglasses, closed shoes', '4x4 convoy',
   $t$A golden-hour desert gathering with music, lounging, and Folake's birthday countdown.$t$,
   'To Be Confirmed', '', 2),

  ('d5-a1', (select id from public.itinerary_days where date = '2026-11-01'),
   'Red Sea Morning — Beach & Water Activities', '9:00 AM', '1:00 PM', 'Resort Beach — To Be Confirmed', 'Resort Beach Entrance', '—',
   'Swimwear & resort casual', 'Swimwear, reef-safe sunscreen, cover-up', 'On-site',
   'An easy morning by the water — snorkeling, sun, and time to breathe before the finale.',
   'To Be Confirmed', '', 1),
  ('d5-a2', (select id from public.itinerary_days where date = '2026-11-01'),
   $t$Folake's 50th Birthday Gala Dinner$t$, '7:30 PM', '11:59 PM', 'Resort Grand Ballroom — To Be Confirmed', 'Resort Lobby', '7:00 PM',
   'Black tie glamour — gold accents encouraged', 'Your best gold accessory', 'On-site',
   $t$The grand finale — a formal gala honoring fifty golden years, with dinner, toasts, dancing, and Folake's official birthday moment.$t$,
   'To Be Confirmed', '', 2),
  ('d5-a3', (select id from public.itinerary_days where date = '2026-11-01'),
   'Departures Begin', '—', '—', 'Various', '—', 'Per individual flight — To Be Confirmed',
   'Travel wear', 'All luggage, travel documents', 'Airport transfers — To Be Confirmed',
   'Farewell hugs and safe travels home. Transfer schedules will be shared via Announcements.',
   'To Be Confirmed', '', 3)
) as v
on conflict (id) do nothing;

insert into public.dress_codes (id, event, date, title, palette, description, inspiration, footwear, avoid, weather, sort_order) values
  ('welcome', 'Welcome Dinner', 'October 28', 'Smart Resort',
   array['#F3EBDA','#C9A667','#1F5A50','#0B0B0C'],
   $t$Smart resort wear — golds, creams, and jewel tones encouraged for the first night's toast.$t$,
   'Linen shirts, midi dresses, light tailoring', 'Dressy sandals or loafers', 'Beachwear, athletic wear',
   'Warm evening breeze — a light layer is wise', 1),
  ('boat', 'The All-White Boat Party', 'October 30', 'All White Tonight',
   array['#FFFFFF','#F3EBDA','#E8E2D0','#C9A667'],
   'Head-to-toe pure white only. Elegant, breezy, glamorous, and ready to float. Think flowing silhouettes that move with the Nile breeze.',
   'Linen sets, silk slip dresses, tailored white suits, breezy kaftans', 'Flat sandals or low block heels — the boat deck can be uneven',
   'Off-white that reads cream in photos, heavy fabrics, stilettos', 'Warm evenings, breeze over water — bring a light white wrap', 2),
  ('desert', 'Desert Chic Sunset Experience', 'October 31', 'Desert Chic',
   array['#C9A667','#8A6A3F','#E8D5A8','#3E2F1C'],
   'Luxury neutrals, flowing fabrics, earthy colors, comfortable footwear, and elevated desert-inspired styling.',
   'Camel, sand, and rust tones; flowing maxi dresses; structured linen separates', 'Comfortable closed shoes or boots — sand-ready',
   'Loose sandals, all-black (absorbs desert heat), delicate fabrics', 'Hot by day, cool by sunset — layer with a light jacket or shawl', 3),
  ('gala', $t$Folake's 50th Birthday Gala$t$, 'November 1', 'Black Tie Glamour',
   array['#0B0B0C','#C9A667','#E8D5A8','#123832'],
   'Black tie glamour with gold accents encouraged — this is the night to shine.',
   'Floor-length gowns, tailored tuxedos, statement gold jewelry', 'Formal — heels or dress shoes',
   'Casual fabrics, sneakers, daywear', 'Indoor, air-conditioned ballroom', 4)
on conflict (id) do nothing;

insert into public.announcements (category, priority, message, created_at) values
  ('General', 'normal', $t$Welcome to the app! Explore your Itinerary, complete your profile in My Trip, and let's get ready for Egypt.$t$, '2026-10-20 11:00:00+00'),
  ('Weather Notice', 'normal', 'Expect warm, sunny conditions all week (28–34°C). Evenings by the Nile carry a light breeze — pack a wrap.', '2026-10-27 08:00:00+00')
on conflict do nothing;
