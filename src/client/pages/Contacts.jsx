import { useEffect, useState } from "react";
import { Phone, MessageCircle, Clock } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle } from "../../shared/ui";
import { CONTACTS } from "../data/staticContent";
import { fetchJsonContent, fetchSiteContent } from "../../lib/queries";

// A contact is only shown to guests once it's real: it needs a phone number
// or a confirmed name. Placeholder rows ("To Be Confirmed") stay admin-side.
function isConfirmed(c) {
  if (c.phone?.trim()) return true;
  const name = (c.name || "").trim();
  return Boolean(name) && !/to be confirmed|tbc|tbd/i.test(name);
}

export default function Contacts() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    let active = true;
    fetchJsonContent("contacts", CONTACTS).then((list) => {
      if (active && Array.isArray(list) && list.length) setContacts(list);
    });
    fetchSiteContent("whatsapp_link")
      .then((value) => active && setWhatsappLink(value?.trim() || ""))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // WhatsApp deep links want digits only.
  const waNumber = (phone) => (phone || "").replace(/[^\d]/g, "");
  const confirmed = contacts.filter(isConfirmed);

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="We're Here to Help" title="Contacts &amp; Emergency" light sub="Tap to call or message." />
      <div className="space-y-3 mb-4">
        {confirmed.map((c, i) => (
          <Card dark key={`${c.role}-${i}`} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>{c.role}</div>
              {c.name?.trim() && (
                <div className="text-[11.5px]" style={{ color: COLORS.ivoryDim }}>{c.name}</div>
              )}
            </div>
            {c.phone?.trim() && (
              <div className="flex gap-2 shrink-0">
                <a
                  href={`tel:${c.phone}`}
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: "var(--chip)" }}
                  aria-label={`Call ${c.role}`}
                >
                  <Phone size={14} color={COLORS.gold} />
                </a>
                {waNumber(c.phone).length >= 7 && (
                  <a
                    href={`https://wa.me/${waNumber(c.phone)}`}
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "var(--chip)" }}
                    aria-label={`Message ${c.role} on WhatsApp`}
                  >
                    <MessageCircle size={14} color={COLORS.gold} />
                  </a>
                )}
              </div>
            )}
          </Card>
        ))}
        {confirmed.length < contacts.length && (
          <Card dark className="flex items-start gap-2.5">
            <Clock size={15} color={COLORS.gold} className="shrink-0 mt-0.5" />
            <p className="text-[12px] leading-relaxed min-w-0" style={{ color: COLORS.ivoryDim }}>
              More contacts will appear here as they're confirmed.
            </p>
          </Card>
        )}
      </div>
      {whatsappLink && (
        <Card dark className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageCircle size={17} color={COLORS.gold} />
            <span className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>Group WhatsApp</span>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="text-[11.5px] font-semibold px-4 py-2 rounded-full min-h-[38px] flex items-center"
            style={{ border: `1.5px solid ${COLORS.gold}`, color: COLORS.gold }}
          >
            Join Group
          </a>
        </Card>
      )}
    </div>
  );
}
