import { Phone, MessageCircle } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle } from "../../shared/ui";
import { CONTACTS } from "../data/staticContent";

export default function Contacts() {
  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="We're Here to Help" title="Contacts &amp; Emergency" light sub="Tap to call or message. All contact details will populate as they're confirmed." />
      <div className="space-y-3 mb-4">
        {CONTACTS.map((c) => (
          <Card dark key={c.role} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>{c.role}</div>
              <div className="text-[11.5px]" style={{ color: COLORS.ivoryDim }}>{c.name}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={c.phone ? `tel:${c.phone}` : "#"}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: "1px solid rgba(201,166,103,0.35)", opacity: c.phone ? 1 : 0.4 }}
                aria-label={`Call ${c.role}`}
              >
                <Phone size={14} color={COLORS.gold} />
              </a>
              <a
                href={c.phone ? `https://wa.me/${c.phone}` : "#"}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: "1px solid rgba(201,166,103,0.35)", opacity: c.phone ? 1 : 0.4 }}
                aria-label={`Message ${c.role} on WhatsApp`}
              >
                <MessageCircle size={14} color={COLORS.gold} />
              </a>
            </div>
          </Card>
        ))}
      </div>
      <Card dark className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageCircle size={17} color={COLORS.gold} />
          <span className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>Group WhatsApp</span>
        </div>
        <a href="#" className="text-[11.5px] px-3 py-2 rounded-full min-h-[36px] flex items-center" style={{ border: "1px solid rgba(201,166,103,0.35)", color: COLORS.gold }}>
          Join Link — TBC
        </a>
      </Card>
    </div>
  );
}
