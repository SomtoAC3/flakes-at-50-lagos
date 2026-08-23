import { COLORS, F } from "../../shared/theme";
import { SectionTitle, Placeholder } from "../../shared/ui";
import { STORY_SECTIONS } from "../data/staticContent";

export default function Story() {
  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Editorial" title="Folake's Story" light sub="Fifty years, told in full — awaiting Folake's biography, photographs, and videos." />
      <Placeholder label="Hero photo of Folake goes here" ratio="aspect-[4/5]" />
      <div className="mt-5 space-y-5">
        {STORY_SECTIONS.map((s) => (
          <div key={s.title}>
            <h3 className="text-[17px] mb-1.5" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>{s.title}</h3>
            <p className="text-[13px] leading-relaxed" style={{ color: COLORS.ivoryDim }}>{s.body}</p>
          </div>
        ))}
        <div>
          <h3 className="text-[17px] mb-2" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>Photo Timeline</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Placeholder key={i} label={`Photo ${i}`} ratio="aspect-square" />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-[17px] mb-2" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>Video Tribute</h3>
          <Placeholder label="Video tribute goes here" ratio="aspect-video" />
        </div>
      </div>
    </div>
  );
}
