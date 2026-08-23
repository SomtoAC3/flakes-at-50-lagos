import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Compass, X, Sun, Upload } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, DetailRow, GoldButton, LoadingNote, ErrorNote } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { fetchDressCodes } from "../../lib/queries";
import { brandingUrl, dressCodePhotoPath } from "../../lib/branding";

export default function DressCodes() {
  const { configured } = useAuth();
  const [codes, setCodes] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!configured) {
      setError("Supabase isn't connected yet, so dress codes can't load.");
      return;
    }
    fetchDressCodes().then(setCodes).catch((e) => setError(e.message));
  }, [configured]);

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Style Guide" title="Dress Codes" light sub="A look for every night of the celebration. Final details may be updated by the organizers." />
      <ErrorNote message={error} />
      {!error && !codes && <LoadingNote label="Loading dress codes…" />}
      {codes && (
        <div className="space-y-4">
          {codes.map((dc) => (
            <DressCodeCard key={dc.id} dc={dc} />
          ))}
          <Card dark className="text-center">
            <Upload size={18} color={COLORS.gold} className="mx-auto mb-2" />
            <p className="text-[13px] mb-3" style={{ color: COLORS.ivory }}>Share Your Look</p>
            <p className="text-[12px] mb-3" style={{ color: COLORS.ivoryDim }}>Upload your outfit for a dress code to inspire fellow guests, from the Gallery tab.</p>
            <Link to="/gallery">
              <GoldButton icon={Upload} variant="outline">Go to Gallery</GoldButton>
            </Link>
          </Card>
          <p className="text-[11px] text-center pt-2 pb-4" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
            Final dress codes &amp; event details may be updated by the organizers.
          </p>
        </div>
      )}
    </div>
  );
}

function DressCodeCard({ dc }) {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <Card dark>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-semibold mb-2" style={{ color: COLORS.gold, fontFamily: F.body }}>
          {dc.event} · {dc.date}
        </div>
      </div>
      <h3 className="text-[19px] mb-2" style={{ fontFamily: F.display, fontWeight: 500, letterSpacing: "-0.02em", color: COLORS.ivory }}>
        {dc.title}
      </h3>
      {dc.palette?.length > 0 && (
        <div className="flex gap-2 mb-3">
          {dc.palette.map((c) => (
            <span key={c} className="w-7 h-7 rounded-lg" style={{ background: c, border: "1px solid var(--line)" }} />
          ))}
        </div>
      )}
      {dc.description && (
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: COLORS.ivoryDim }}>{dc.description}</p>
      )}
      <div className="space-y-2 mb-3">
        {dc.inspiration && <DetailRow icon={Sparkles} label="Inspiration" value={dc.inspiration} />}
        {dc.footwear && <DetailRow icon={Compass} label="Footwear" value={dc.footwear} />}
        {dc.avoid && <DetailRow icon={X} label="Avoid" value={dc.avoid} />}
        {dc.weather && <DetailRow icon={Sun} label="Weather" value={dc.weather} />}
      </div>
      {photoOk && (
        <img
          src={brandingUrl(dressCodePhotoPath(dc.id))}
          alt={`Inspiration for ${dc.title}`}
          className="w-full rounded-2xl object-cover aspect-[16/7]"
          style={{ border: `1px solid ${COLORS.line}` }}
          onError={() => setPhotoOk(false)}
        />
      )}
    </Card>
  );
}
