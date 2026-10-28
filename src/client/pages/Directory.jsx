import { useEffect, useState } from "react";
import { Phone, MessageCircle, MapPin, Star, ArrowUpRight } from "lucide-react";
import { COLORS, DISPLAY_LUXE } from "../../shared/theme";
import { Card, SectionTitle, GoldButton } from "../../shared/ui";
import { Stem } from "../../shared/flora";
import { DIRECTORY } from "../data/staticContent";
import { fetchJsonContent, fetchSiteContent } from "../../lib/queries";
import { fetchPlacePhoto } from "../../lib/placePhotos";

// An entry is only shown to guests once it's real: it needs a number, an
// address, or a confirmed name. Placeholder rows ("To Be Confirmed") stay
// admin-side.
function isConfirmed(e) {
  if (e.phone?.trim() || e.whatsapp?.trim() || e.address?.trim()) return true;
  const name = (e.name || "").trim();
  return Boolean(name) && !/to be confirmed|tbc|tbd/i.test(name);
}

// Entries grouped by category, in the order each category first appears.
function groupByCategory(entries) {
  const groups = new Map();
  for (const e of entries) {
    const key = e.category?.trim() || "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
  return [...groups.entries()];
}

// Places (anything with an address or photo) get a cover card; people and
// phone lines stay compact rows.
const isPlace = (e) => Boolean(e.address?.trim() || e.image?.trim());

// WhatsApp deep links want digits only, with the country code.
const waNumber = (phone) => (phone || "").replace(/[^\d]/g, "");
const placeQuery = (e) => `${e.name}, ${e.address}, Lagos`;
const mapsUrl = (e) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeQuery(e))}`;
// The neighbourhood is the last part of the address ("…, Lekki Phase 1").
const areaOf = (address) => address.split(",").pop().trim();

// Without a photo, each category's covers get their own flower on a tint
// of its colour, so the cards still read as a set.
const COVER_FLOWERS = [
  { kind: "ranunculus", tint: "var(--flower-rose)" },
  { kind: "poppy", tint: "var(--flower-coral)" },
  { kind: "cosmos", tint: "var(--flower-lilac)" },
  { kind: "daisy", tint: "var(--flower-butter)" },
  { kind: "tulip", tint: "var(--flower-coral)" },
];

// Frosted ground for controls laid over a cover, readable on any photo.
const OVERLAY = { background: "color-mix(in srgb, var(--card) 88%, transparent)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" };

function ContactButtons({ entry, overlay = false }) {
  const phone = entry.phone?.trim();
  const whatsapp = waNumber(entry.whatsapp);
  const buttons = [
    phone && { href: `tel:${phone.replace(/\s/g, "")}`, label: `Call ${entry.name}`, Icon: Phone },
    whatsapp.length >= 7 && { href: `https://wa.me/${whatsapp}`, label: `Message ${entry.name} on WhatsApp`, Icon: MessageCircle },
  ].filter(Boolean);
  if (!buttons.length) return null;
  return (
    <div className="flex gap-2 shrink-0">
      {buttons.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={overlay ? OVERLAY : { background: "var(--chip)" }}
          aria-label={label}
        >
          <Icon size={15} color={COLORS.gold} />
        </a>
      ))}
    </div>
  );
}

// A place's Google photo, when it has no uploaded one. Null until it loads,
// and for good if Google has none or the lookup is switched off.
function useGooglePhoto(entry) {
  const query = entry.image?.trim() || !entry.address?.trim() ? null : placeQuery(entry);
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (!query) return;
    let active = true;
    fetchPlacePhoto(query).then((photo) => active && setResult({ query, photo }));
    return () => {
      active = false;
    };
  }, [query]);
  return result?.query === query ? result.photo : null;
}

function Cover({ entry, flower }) {
  const google = useGooglePhoto(entry);
  const [failed, setFailed] = useState(false);
  if (entry.image?.trim()) {
    return <img src={entry.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />;
  }
  if (google && !failed) {
    // Google asks for the photographer's name, linked, wherever its photos show.
    return (
      <>
        <img src={google.src} alt="" loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 w-full h-full object-cover" />
        <a
          href={google.authorUrl || undefined}
          target="_blank"
          rel="noreferrer"
          className="absolute top-3 right-3 max-w-[70%] truncate rounded-full px-2.5 py-1 text-[10px]"
          style={{ ...OVERLAY, color: COLORS.ivoryDim }}
        >
          {google.author ? `Photo: ${google.author} · Google Maps` : "Photo: Google Maps"}
        </a>
      </>
    );
  }
  return (
    <div className="absolute inset-0" style={{ background: `color-mix(in srgb, ${flower.tint} 22%, var(--card))` }}>
      <Stem
        kind={flower.kind}
        flower={flower.tint}
        leaf={COLORS.leaf}
        center={COLORS.gold}
        width={112}
        className="absolute left-1/2 top-[14%] -translate-x-1/2"
      />
    </div>
  );
}

function GoogleRow({ entry }) {
  const rating = parseFloat(entry.rating);
  const reviews = parseInt(String(entry.reviews || "").replace(/[^\d]/g, ""), 10);
  return (
    <a
      href={mapsUrl(entry)}
      target="_blank"
      rel="noreferrer"
      className="mt-4 pt-3 flex items-center gap-1.5 text-[12.5px] min-h-[44px]"
      style={{ borderTop: `1px solid ${COLORS.line}`, color: COLORS.ivoryDim }}
    >
      {rating > 0 ? (
        <>
          <Star size={14} fill="currentColor" strokeWidth={0} style={{ color: COLORS.gold }} />
          <span className="font-semibold" style={{ color: COLORS.ivory }}>{rating.toFixed(1)}</span>
          {reviews > 0 && <span>· {reviews.toLocaleString()} reviews on Google</span>}
          {!(reviews > 0) && <span>on Google</span>}
        </>
      ) : (
        <span>Reviews &amp; directions on Google</span>
      )}
      <ArrowUpRight size={14} className="ml-auto" color={COLORS.gold} />
    </a>
  );
}

function PlaceCard({ entry, flower }) {
  const address = entry.address?.trim();
  return (
    <article className="rounded-[26px] p-2.5" style={{ background: COLORS.card, border: "1px solid var(--line)" }}>
      <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden">
        <Cover entry={entry} flower={flower} />
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          {address ? (
            <a
              href={mapsUrl(entry)}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 flex items-center gap-1.5 rounded-full pl-3 pr-3.5 h-9 text-[12px] font-medium"
              style={{ ...OVERLAY, color: COLORS.ivory }}
              aria-label={`Directions to ${entry.name}`}
            >
              <MapPin size={13} color={COLORS.gold} className="shrink-0" />
              <span className="truncate">{areaOf(address)}</span>
            </a>
          ) : (
            <span />
          )}
          <ContactButtons entry={entry} overlay />
        </div>
      </div>
      <div className="px-2.5 pt-4 pb-1">
        <h3 className="text-[24px] leading-[1.1]" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, textWrap: "balance" }}>{entry.name}</h3>
        {address && (
          <p className="text-[12px] mt-1" style={{ color: COLORS.ivoryDim }}>{address}</p>
        )}
        {entry.bio?.trim() && (
          <p className="text-[14px] leading-relaxed mt-2.5" style={{ color: COLORS.ivory }}>{entry.bio}</p>
        )}
        {address && <GoogleRow entry={entry} />}
      </div>
    </article>
  );
}

function PersonRow({ entry }) {
  return (
    <li className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b" style={{ borderColor: COLORS.line }}>
      <div className="flex-1 min-w-0">
        <div className="text-[19px] leading-tight" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>{entry.name}</div>
        {entry.detail?.trim() && (
          <div className="text-[12px] mt-0.5" style={{ color: COLORS.ivoryDim }}>{entry.detail}</div>
        )}
      </div>
      <ContactButtons entry={entry} />
    </li>
  );
}

export default function Directory() {
  const [entries, setEntries] = useState(DIRECTORY);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    let active = true;
    fetchJsonContent("directory", DIRECTORY).then((list) => {
      if (active && Array.isArray(list) && list.length) setEntries(list);
    });
    fetchSiteContent("whatsapp_link")
      .then((value) => active && setWhatsappLink(value?.trim() || ""))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const groups = groupByCategory(entries.filter(isConfirmed));
  // One category at a time; the first is open until a guest picks another.
  const index = Math.max(0, groups.findIndex(([category]) => category === filter));
  const [current, list = []] = groups[index] || [];
  const flower = COVER_FLOWERS[index % COVER_FLOWERS.length];
  const places = list.filter(isPlace);
  const people = list.filter((e) => !isPlace(e));

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Around Lagos" title="Directory" sub="Places we love and people to call." />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
        {groups.map(([category]) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            aria-pressed={current === category}
            className="shrink-0 rounded-full px-4 py-1.5 text-[11.5px] font-medium min-h-[36px]"
            style={{
              background: current === category ? COLORS.gold : COLORS.card,
              color: current === category ? COLORS.ink : COLORS.ivoryDim,
              border: current === category ? "none" : "1px solid var(--line)",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-5">
        {places.map((e, i) => (
          <PlaceCard key={`${e.name}-${i}`} entry={e} flower={flower} />
        ))}

        {people.length > 0 && (
          <Card>
            <ul>
              {people.map((e, i) => (
                <PersonRow key={`${e.name}-${i}`} entry={e} />
              ))}
            </ul>
          </Card>
        )}

        {whatsappLink && /host/i.test(current || "") && (
          <Card className="grid gap-3">
            <div className="flex items-center gap-2.5">
              <MessageCircle size={17} color={COLORS.gold} />
              <span className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>Group WhatsApp</span>
            </div>
            <GoldButton as="a" variant="outline" href={whatsappLink} target="_blank" rel="noreferrer">
              Join Group
            </GoldButton>
          </Card>
        )}
      </div>
    </div>
  );
}
