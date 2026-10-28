import { useEffect, useState } from "react";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, GoldButton, Field, ErrorNote, LoadingNote } from "../../shared/ui";
import { fetchJsonContent, saveJsonContent, fetchSiteContent, saveSiteContent } from "../../lib/queries";
import { FAQS, CONTACTS, TRAVEL_SECTIONS, PACKING_LIST, STORY_SECTIONS } from "../../client/data/staticContent";

// Each editor manages one JSON list in site_content. The bundled defaults
// prefill the editor the first time, so organizers edit rather than start
// from a blank page — guests see the same defaults until a save happens.
const EDITORS = [
  {
    key: "faqs",
    title: "FAQs",
    page: "FAQ page",
    fallback: FAQS,
    blank: { q: "", a: "" },
    fields: [
      { name: "q", label: "Question" },
      { name: "a", label: "Answer", multiline: true },
    ],
    itemLabel: (item) => item.q,
  },
  {
    key: "contacts",
    title: "Contacts",
    page: "Contacts page",
    fallback: CONTACTS,
    blank: { role: "", name: "", phone: "" },
    fields: [
      { name: "role", label: "Role" },
      { name: "name", label: "Name" },
      { name: "phone", label: "Phone (with country code, e.g. +2010...)" },
    ],
    itemLabel: (item) => item.role,
  },
  {
    key: "travel_sections",
    title: "Travel Information",
    page: "Travel page",
    fallback: TRAVEL_SECTIONS,
    blank: { title: "", body: "" },
    fields: [
      { name: "title", label: "Title" },
      { name: "body", label: "Body", multiline: true },
    ],
    itemLabel: (item) => item.title,
  },
  {
    key: "packing_list",
    title: "Packing Checklist",
    page: "Travel page",
    fallback: PACKING_LIST,
    blank: "",
    fields: null, // plain strings
    itemLabel: (item) => item,
  },
  {
    key: "story_sections",
    title: "Folake's Story",
    page: "Story page — guests see a \"coming soon\" card until sections are saved here",
    fallback: STORY_SECTIONS.map((s) => ({ title: s.title, body: "" })),
    blank: { title: "", body: "" },
    fields: [
      { name: "title", label: "Section title" },
      { name: "body", label: "Section text", multiline: true },
    ],
    itemLabel: (item) => item.title,
  },
];

export default function Content() {
  return (
    <div>
      <SectionTitle
        eyebrow="Edit"
        title="Site Content"
        light
        sub="Everything guests read on the FAQ, Contacts, Travel, and Story pages. Saves go live immediately."
      />
      <WhatsAppLinkCard />
      {EDITORS.map((cfg) => (
        <ListEditor key={cfg.key} cfg={cfg} />
      ))}
    </div>
  );
}

function WhatsAppLinkCard() {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSiteContent("whatsapp_link")
      .then((value) => {
        setLink(value ?? "");
        setStatus("idle");
      })
      .catch((e) => {
        setError(e.message);
        setStatus("idle");
      });
  }, []);

  async function save() {
    setStatus("saving");
    setError("");
    try {
      await saveSiteContent("whatsapp_link", link.trim());
      setStatus("saved");
    } catch (e) {
      setError(e.message);
      setStatus("idle");
    }
  }

  return (
    <Card dark className="mb-4">
      <ErrorNote message={error} />
      <p className="text-[13px] mb-1" style={{ color: COLORS.ivory }}>Group WhatsApp Link</p>
      <p className="text-[11.5px] leading-relaxed mb-3" style={{ color: COLORS.ivoryDim }}>
        The invite link for the guest WhatsApp group (from WhatsApp → Group → Invite via link). The join card on the Contacts page is hidden until this is set.
      </p>
      <div className="mb-3">
        <Field label="Invite link" value={link} onChange={(v) => { setLink(v); setStatus("idle"); }} placeholder="https://chat.whatsapp.com/…" />
      </div>
      <GoldButton className="w-full" disabled={status === "loading" || status === "saving"} onClick={save}>
        {status === "saving" ? "Saving…" : "Save Link"}
      </GoldButton>
      {status === "saved" && (
        <p className="text-[11.5px] mt-3 text-center" style={{ color: COLORS.gold }}>
          Saved.
        </p>
      )}
    </Card>
  );
}

function ListEditor({ cfg }) {
  const [items, setItems] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | dirty | saving | saved
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchJsonContent(cfg.key, cfg.fallback).then((list) => {
      if (active) setItems(Array.isArray(list) ? list : cfg.fallback);
    });
    return () => {
      active = false;
    };
  }, [cfg]);

  function update(next) {
    setItems(next);
    setStatus("dirty");
  }

  function setItem(i, value) {
    update(items.map((item, idx) => (idx === i ? value : item)));
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const cleaned = items.filter((item) =>
        cfg.fields ? cfg.fields.some((f) => (item[f.name] || "").trim()) : (item || "").trim()
      );
      await saveJsonContent(cfg.key, cleaned);
      setItems(cleaned);
      setStatus("saved");
    } catch (e) {
      setError(e.message);
      setStatus("dirty");
    }
  }

  if (items === null) {
    return (
      <Card dark className="mb-4">
        <p className="text-[13px]" style={{ color: COLORS.ivory }}>{cfg.title}</p>
        <LoadingNote />
      </Card>
    );
  }

  return (
    <Card dark className="mb-4">
      <ErrorNote message={error} />
      <button className="w-full text-left flex items-center justify-between gap-3 min-h-[36px]" onClick={() => setExpanded(!expanded)}>
        <div className="min-w-0">
          <p className="text-[13px]" style={{ color: COLORS.ivory }}>{cfg.title}</p>
          <p className="text-[11px]" style={{ color: COLORS.ivoryDim }}>
            {items.length} item{items.length === 1 ? "" : "s"} · shown on the {cfg.page}
          </p>
        </div>
        <ChevronDown
          size={16}
          color={COLORS.gold}
          className="shrink-0"
          style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        />
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-[3px] p-3" style={{ border: "1px solid var(--line)", background: "var(--chip)" }}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] truncate" style={{ color: COLORS.ivoryDim }}>
                  {cfg.itemLabel(item) || `Item ${i + 1}`}
                </span>
                <div className="flex gap-1 shrink-0">
                  <IconButton label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ChevronUp size={13} color={COLORS.gold} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                    <ChevronDown size={13} color={COLORS.gold} />
                  </IconButton>
                  <IconButton label="Delete" onClick={() => update(items.filter((_, idx) => idx !== i))}>
                    <Trash2 size={13} color="#E0685C" />
                  </IconButton>
                </div>
              </div>
              {cfg.fields ? (
                <div className="space-y-2">
                  {cfg.fields.map((f) => (
                    <Field
                      key={f.name}
                      label={f.label}
                      value={item[f.name]}
                      multiline={f.multiline}
                      onChange={(v) => setItem(i, { ...item, [f.name]: v })}
                    />
                  ))}
                </div>
              ) : (
                <Field label="Item" value={item} onChange={(v) => setItem(i, v)} />
              )}
            </div>
          ))}

          <GoldButton variant="outline" className="w-full" onClick={() => update([...items, cfg.blank])}>
            Add Item
          </GoldButton>
          <GoldButton className="w-full" disabled={status === "saving" || status !== "dirty"} onClick={save}>
            {status === "saving" ? "Saving…" : "Save Changes"}
          </GoldButton>
          {status === "saved" && (
            <p className="text-[11.5px] text-center" style={{ color: COLORS.gold }}>
              Saved — live for guests.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function IconButton({ label, onClick, disabled, children }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-[3px] flex items-center justify-center disabled:opacity-30"
      style={{ border: "1px solid var(--line)" }}
    >
      {children}
    </button>
  );
}
