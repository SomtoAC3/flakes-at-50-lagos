import { AlertTriangle, Check } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle } from "../../shared/ui";
import { TRAVEL_SECTIONS, PACKING_LIST } from "../data/staticContent";

export default function Travel() {
  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Plan Ahead" title="Travel Information" light sub="Everything you need to arrive prepared. Details marked 'To Be Confirmed' will be updated as they're finalized." />
      <Card dark className="mb-4 flex items-start gap-2.5">
        <AlertTriangle size={15} color={COLORS.gold} className="shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed min-w-0" style={{ color: COLORS.ivory }}>
          This app does not provide legal or visa advice. Please confirm current entry requirements with official Egyptian authorities or your airline before booking travel.
        </p>
      </Card>
      <div className="space-y-3 mb-6">
        {TRAVEL_SECTIONS.map((s) => (
          <Card dark key={s.title}>
            <div className="mb-1.5">
              <span className="text-[14px] font-semibold" style={{ color: COLORS.ivory, fontFamily: F.display }}>{s.title}</span>
            </div>
            <p className="text-[12.5px] leading-relaxed" style={{ color: COLORS.ivoryDim }}>{s.body}</p>
          </Card>
        ))}
      </div>
      <SectionTitle eyebrow="Don't Forget" title="Packing Checklist" light />
      <Card dark className="mb-4">
        <div className="space-y-2.5">
          {PACKING_LIST.map((p) => (
            <div key={p} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center" style={{ border: `1px solid ${COLORS.gold}` }}>
                <Check size={10} color={COLORS.gold} />
              </div>
              <span className="text-[12.5px]" style={{ color: COLORS.ivory }}>{p}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
