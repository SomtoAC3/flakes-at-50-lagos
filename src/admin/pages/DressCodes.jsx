import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown, ImagePlus } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, GoldButton, Field, ErrorNote, LoadingNote } from "../../shared/ui";
import { supabase } from "../../lib/supabaseClient";
import { fetchDressCodes, saveDressCode, deleteDressCode, swapDressCodeOrder } from "../../lib/queries";
import { brandingUrl, dressCodePhotoPath } from "../../lib/branding";

// Banner photos are stored in the branding bucket at a fixed path per dress
// code, so the guest page can reference them without a schema change.
async function uploadBanner(id, file) {
  const img = await createImageBitmap(file);
  const maxW = 1200;
  const scale = Math.min(1, maxW / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't process the image."))), "image/jpeg", 0.85)
  );
  const { error } = await supabase.storage
    .from("branding")
    .upload(dressCodePhotoPath(id), blob, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });
  if (error) throw error;
}

export default function AdminDressCodes() {
  const [codes, setCodes] = useState(null);
  const [editing, setEditing] = useState(null); // null | {} for new | dress code row
  const [error, setError] = useState("");

  async function reload() {
    try {
      setCodes(await fetchDressCodes());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleSave(form) {
    setError("");
    try {
      const maxOrder = codes.reduce((m, c) => Math.max(m, c.sort_order), 0);
      await saveDressCode({ ...form, sort_order: form.id ? form.sort_order : maxOrder + 1 });
      setEditing(null);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(dc) {
    if (!window.confirm(`Delete the "${dc.title}" dress code? Guests will no longer see it.`)) return;
    setError("");
    try {
      await deleteDressCode(dc.id);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleMove(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= codes.length) return;
    setError("");
    try {
      await swapDressCodeOrder(codes[i], codes[j]);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Style Guide"
        title="Dress Codes"
        light
        sub="The looks guests see on the Dress Codes page. Changes go live immediately."
      />
      <ErrorNote message={error} />

      {editing !== null ? (
        <DressCodeForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      ) : codes === null ? (
        <LoadingNote label="Loading dress codes…" />
      ) : (
        <div className="space-y-3">
          {codes.map((dc, i) => (
            <Card dark key={dc.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10.5px] font-semibold mb-1" style={{ color: COLORS.gold, fontFamily: F.body }}>
                    {dc.event} · {dc.date}
                  </div>
                  <div className="text-[15px]" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>
                    {dc.title}
                  </div>
                  {dc.palette?.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {dc.palette.map((c) => (
                        <span key={c} className="w-5 h-5 rounded-md" style={{ background: c, border: "1px solid var(--line)" }} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <IconButton label="Move up" onClick={() => handleMove(i, -1)} disabled={i === 0}>
                    <ChevronUp size={13} color={COLORS.gold} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => handleMove(i, 1)} disabled={i === codes.length - 1}>
                    <ChevronDown size={13} color={COLORS.gold} />
                  </IconButton>
                  <IconButton label="Edit" onClick={() => setEditing(dc)}>
                    <Pencil size={13} color={COLORS.gold} />
                  </IconButton>
                  <IconButton label="Delete" onClick={() => handleDelete(dc)}>
                    <Trash2 size={13} color="#E0685C" />
                  </IconButton>
                </div>
              </div>
              <BannerUpload id={dc.id} title={dc.title} onError={setError} />
            </Card>
          ))}
          <GoldButton variant="outline" className="w-full" onClick={() => setEditing({})}>
            Add Dress Code
          </GoldButton>
        </div>
      )}
    </div>
  );
}

function BannerUpload({ id, title, onError }) {
  const fileRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [version, setVersion] = useState(() => Date.now());
  const [hasPhoto, setHasPhoto] = useState(true);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setStatus("uploading");
    try {
      await uploadBanner(id, file);
      setHasPhoto(true);
      setVersion(Date.now());
      setStatus("idle");
    } catch (err) {
      setStatus("idle");
      onError(err.message || "Upload failed.");
    }
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      {hasPhoto && (
        <img
          src={brandingUrl(dressCodePhotoPath(id), version)}
          alt={`Inspiration for ${title}`}
          className="h-12 w-24 rounded-[3px] object-cover shrink-0"
          style={{ border: `1px solid ${COLORS.line}` }}
          onError={() => setHasPhoto(false)}
        />
      )}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={status === "uploading"}
        className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-2 rounded-[3px] min-h-[36px] disabled:opacity-50"
        style={{ border: `1.5px solid ${COLORS.gold}`, color: COLORS.gold }}
      >
        <ImagePlus size={13} />
        {status === "uploading" ? "Uploading…" : hasPhoto ? "Replace inspiration photo" : "Add inspiration photo"}
      </button>
    </div>
  );
}

function DressCodeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: initial.id,
    event: initial.event || "",
    date: initial.date || "",
    title: initial.title || "",
    description: initial.description || "",
    inspiration: initial.inspiration || "",
    footwear: initial.footwear || "",
    avoid: initial.avoid || "",
    weather: initial.weather || "",
    sort_order: initial.sort_order ?? 0,
  });
  // Edited as comma-separated hex values, stored as a text[] column.
  const [paletteText, setPaletteText] = useState((initial.palette || []).join(", "));
  const [saving, setSaving] = useState(false);

  const set = (name) => (v) => setForm((f) => ({ ...f, [name]: v }));

  async function submit() {
    setSaving(true);
    const palette = paletteText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await onSave({ ...form, palette });
    setSaving(false);
  }

  return (
    <Card dark>
      <p className="text-[13px] mb-4" style={{ color: COLORS.ivory }}>
        {form.id ? "Edit Dress Code" : "New Dress Code"}
      </p>
      <div className="space-y-2.5 mb-4">
        <Field label="Event" value={form.event} onChange={set("event")} placeholder="e.g. Boat Party" />
        <Field label="Date" value={form.date} onChange={set("date")} placeholder="e.g. Dec 12" />
        <Field label="Title" value={form.title} onChange={set("title")} placeholder="e.g. All-White Everything" />
        <Field
          label="Palette (comma-separated colors)"
          value={paletteText}
          onChange={setPaletteText}
          placeholder="#FFFFFF, #C9A667"
        />
        <Field label="Description" value={form.description} onChange={set("description")} multiline />
        <Field label="Inspiration" value={form.inspiration} onChange={set("inspiration")} />
        <Field label="Footwear" value={form.footwear} onChange={set("footwear")} />
        <Field label="Avoid" value={form.avoid} onChange={set("avoid")} />
        <Field label="Weather" value={form.weather} onChange={set("weather")} />
      </div>
      <div className="grid gap-2">
        <GoldButton disabled={saving || !form.title.trim() || !form.event.trim() || !form.date.trim()} onClick={submit}>
          {saving ? "Saving…" : "Save"}
        </GoldButton>
        <GoldButton variant="ghost" onClick={onCancel}>
          Cancel
        </GoldButton>
      </div>
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
      style={{ border: `1px solid ${COLORS.line}` }}
    >
      {children}
    </button>
  );
}
