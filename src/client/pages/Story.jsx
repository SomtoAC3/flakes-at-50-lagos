import { useEffect, useState } from "react";
import { COLORS, F } from "../../shared/theme";
import { SectionTitle, Card } from "../../shared/ui";
import { fetchJsonContent } from "../../lib/queries";
import { brandingUrl, BRANDING_PATHS } from "../../lib/branding";

// The story stays hidden behind a graceful "coming soon" card until the
// organizers write it in Admin → Content — no placeholder scaffolding
// should ever show guest-side.
export default function Story() {
  const [sections, setSections] = useState(null); // null = loading
  const [heroOk, setHeroOk] = useState(true);

  useEffect(() => {
    let active = true;
    fetchJsonContent("story_sections", []).then((list) => {
      if (active) setSections(Array.isArray(list) ? list : []);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Editorial" title="Folake's Story" light sub="Fifty years, told in full." />
      {heroOk && (
        <img
          src={brandingUrl(BRANDING_PATHS.storyHero)}
          alt="Folake"
          className="w-full rounded-[3px] object-cover aspect-[4/5] mb-5"
          style={{ border: `1px solid ${COLORS.line}` }}
          onError={() => setHeroOk(false)}
        />
      )}
      {sections === null ? null : sections.length ? (
        <div className="space-y-5 pb-4">
          {sections.map((s, i) => (
            <div key={`${s.title}-${i}`}>
              <h3 className="text-[17px] mb-1.5" style={{ fontFamily: F.display, fontWeight: 500, letterSpacing: "-0.02em", color: COLORS.ivory }}>{s.title}</h3>
              <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: COLORS.ivoryDim }}>{s.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <Card dark>
          <p className="text-[13px] leading-relaxed text-center py-4" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
            Her story is still being written — check back soon.
          </p>
        </Card>
      )}
    </div>
  );
}
