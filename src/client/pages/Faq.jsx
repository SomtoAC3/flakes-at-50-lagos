import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle } from "../../shared/ui";
import { FAQS } from "../data/staticContent";
import { fetchJsonContent } from "../../lib/queries";

export default function Faq() {
  const [open, setOpen] = useState(null);
  const [faqs, setFaqs] = useState(FAQS);

  useEffect(() => {
    let active = true;
    fetchJsonContent("faqs", FAQS).then((list) => {
      if (active && Array.isArray(list) && list.length) setFaqs(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Good to Know" title="Frequently Asked Questions" light />
      <div className="space-y-2.5">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Card dark key={f.q} className="!p-0 overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : i)} className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 min-h-[44px]">
                <span className="text-[13px] font-medium" style={{ color: COLORS.ivory }}>{f.q}</span>
                <ChevronDown size={15} color={COLORS.gold} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} className="shrink-0" />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-[12.5px] leading-relaxed" style={{ color: COLORS.ivoryDim, borderTop: "1px solid rgba(201,166,103,0.12)" }}>
                  <div className="pt-3">{f.a}</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
