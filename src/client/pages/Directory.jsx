import { useEffect, useState } from "react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, Badge, LoadingNote, ErrorNote } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { fetchDirectory, updateGuestProfile, publicGalleryUrl } from "../../lib/queries";

function GuestAvatar({ guest }) {
  const [imgOk, setImgOk] = useState(true);
  const showImg = guest.avatar_path && imgOk;
  return (
    <div
      className="w-14 h-14 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center"
      style={{ border: "1px solid rgba(17,17,17,0.09)", background: "#F0F0EE" }}
    >
      {showImg ? (
        <img src={publicGalleryUrl(guest.avatar_path)} alt={guest.name || "Guest"} className="w-full h-full object-cover" onError={() => setImgOk(false)} />
      ) : (
        <span className="text-[18px]" style={{ color: COLORS.gold, fontFamily: F.display, fontWeight: 600 }}>
          {(guest.name || "?").trim().charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function Directory() {
  const { user, profile, refreshProfile } = useAuth();
  const [guests, setGuests] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDirectory()
      .then(setGuests)
      .catch((e) => setError(e.message));
  }, []);

  async function toggleOptIn() {
    try {
      await updateGuestProfile(user.id, { directory_opt_in: !profile.directory_opt_in });
      await refreshProfile();
      // Opting in/out changes whether *you* appear — refresh the list too.
      fetchDirectory().then(setGuests).catch(() => {});
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Who's Coming" title="Guest Directory" light sub="A privacy-conscious look at who's celebrating with Folake. Private contact information is never shown here." />
      <ErrorNote message={error} />

      {profile && (
        <Card dark className="mb-5 flex items-center justify-between">
          <div className="pr-3">
            <div className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>Appear in the Directory</div>
            <div className="text-[11.5px]" style={{ color: COLORS.ivoryDim }}>Turn off to hide your profile from other guests.</div>
          </div>
          <button
            onClick={toggleOptIn}
            className="w-11 h-6 rounded-full relative shrink-0"
            style={{ background: profile.directory_opt_in ? COLORS.gold : "rgba(17,17,17,0.15)" }}
            aria-label="Toggle directory visibility"
          >
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: profile.directory_opt_in ? 22 : 2 }} />
          </button>
        </Card>
      )}

      {!guests && !error && <LoadingNote label="Loading the directory…" />}

      {guests && (
        <div className="space-y-3">
          {guests.length === 0 && (
            <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
              No one has opted into the directory yet — set your RSVP to Attending and turn on "Appear in the Directory" to be the first.
            </p>
          )}
          {guests.map((g) => (
            <Card dark key={g.id} className="flex items-start gap-3">
              <GuestAvatar guest={g} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold" style={{ color: COLORS.ivory, fontFamily: F.display, letterSpacing: "-0.02em", fontWeight: 500 }}>{g.name || "A guest"}</span>
                  {g.relationship && <Badge tone="emerald">{g.relationship}</Badge>}
                </div>
                {g.location && <div className="text-[11.5px] mb-1.5" style={{ color: COLORS.ivoryDim }}>{g.location}</div>}
                {g.message && <p className="text-[12.5px] italic leading-snug" style={{ color: COLORS.ivory }}>"{g.message}"</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
