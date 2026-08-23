import { useEffect, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle } from "../../shared/ui";
import { TRAVEL_SECTIONS, PACKING_LIST } from "../data/staticContent";
import { fetchJsonContent } from "../../lib/queries";

export default function Travel() {
  const [sections, setSections] = useState(TRAVEL_SECTIONS);
  const [packing, setPacking] = useState(PACKING_LIST);

  useEffect(() => {
    let active = true;
    fetchJsonContent("travel_sections", TRAVEL_SECTIONS).then((list) => {
      if (active && Array.isArray(list) && list.length) setSections(list);
    });
    fetchJsonContent("packing_list", PACKING_LIST).then((list) => {
      if (active && Array.isArray(list) && list.length) setPacking(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Plan Ahead" title="Travel Information" light sub="Everything you need to arrive prepared." />
      <Card dark className="mb-4 flex items-start gap-2.5">
        <AlertTriangle size={15} color={COLORS.gold} className="shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed min-w-0" style={{ color: COLORS.ivory }}>
          This app does not provide legal or visa advice. Please confirm current entry requirements with official Egyptian authorities or your airline before booking travel.
        </p>
      </Card>
      <div className="space-y-3 mb-6">
        {sections.map((s, i) => (
          <Card dark key={`${s.title}-${i}`}>
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
          {packing.map((p, i) => (
            <div key={`${p}-${i}`} className="flex items-start gap-2.5">
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
