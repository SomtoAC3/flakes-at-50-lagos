import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, GoldButton, Field, ErrorNote } from "../../shared/ui";
import { supabase } from "../../lib/supabaseClient";
import { fetchSiteContent, saveSiteContent } from "../../lib/queries";
import { brandingUrl, BRANDING_PATHS } from "../../lib/branding";

// The manifest, index.html, and service worker all reference these exact
// paths, so uploading here updates the installed app's icon everywhere.
const ICON_SIZES = [
  { path: BRANDING_PATHS.icon512, px: 512 },
  { path: BRANDING_PATHS.icon192, px: 192 },
  { path: BRANDING_PATHS.appleTouch, px: 180 },
];

function renderSquare(img, px) {
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FAFAF9";
  ctx.fillRect(0, 0, px, px);
  // Center-crop to a square, then scale to fit.
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, px, px);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't process the image."))), "image/png")
  );
}

async function uploadSquares(file, sizes) {
  const img = await createImageBitmap(file);
  for (const { path, px } of sizes) {
    const blob = await renderSquare(img, px);
    const { error } = await supabase.storage
      .from("branding")
      .upload(path, blob, { upsert: true, contentType: "image/png", cacheControl: "3600" });
    if (error) throw error;
  }
}

export default function Settings() {
  return (
    <div>
      <SectionTitle
        eyebrow="Configure"
        title="Settings"
        light
        sub="App identity and site copy. Changes go live for guests immediately."
      />
      <ImageUploadCard
        title="App Icon"
        description="Shown when guests save the site to their home screen, and on announcement notifications. Upload a square image, at least 512×512. Guests who already saved the app will see the new icon after re-adding it."
        previewPath={BRANDING_PATHS.icon192}
        sizes={ICON_SIZES}
        rounded="rounded-[3px]"
      />
      <ImageUploadCard
        title="Folake's Photo"
        description="Shown beside the welcome note on the guest home page. Until one is uploaded, guests see the note without a photo."
        previewPath={BRANDING_PATHS.folakePhoto}
        sizes={[{ path: BRANDING_PATHS.folakePhoto, px: 512 }]}
        rounded="rounded-[3px]"
      />
      <ImageUploadCard
        title="Story Hero Photo"
        description="The large portrait at the top of Folake's Story page. Until one is uploaded, the page shows the story without a photo."
        previewPath={BRANDING_PATHS.storyHero}
        sizes={[{ path: BRANDING_PATHS.storyHero, px: 1024 }]}
        rounded="rounded-[3px]"
      />
      <WelcomeNoteCard />
    </div>
  );
}

function ImageUploadCard({ title, description, previewPath, sizes, rounded }) {
  const fileRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | done
  const [error, setError] = useState("");
  // Cache-buster so the preview refreshes after an upload.
  const [version, setVersion] = useState(() => Date.now());
  const [previewFailed, setPreviewFailed] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setStatus("uploading");
    setError("");
    try {
      await uploadSquares(file, sizes);
      setStatus("done");
      setPreviewFailed(false);
      setVersion(Date.now());
    } catch (err) {
      setStatus("idle");
      setError(err.message || "Upload failed.");
    }
  }

  return (
    <Card dark className="mb-4">
      <ErrorNote message={error} />
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-20 h-20 ${rounded} overflow-hidden flex items-center justify-center shrink-0`}
          style={{ background: "var(--chip)", border: "1px solid var(--line)" }}
        >
          {previewFailed ? (
            <span className="text-[10px] text-center px-2" style={{ color: COLORS.ivoryDim }}>
              None yet
            </span>
          ) : (
            <img
              src={brandingUrl(previewPath, version)}
              alt={`Current ${title.toLowerCase()}`}
              className="w-full h-full object-cover"
              onError={() => setPreviewFailed(true)}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] mb-1" style={{ color: COLORS.ivory }}>{title}</p>
          <p className="text-[11.5px] leading-relaxed" style={{ color: COLORS.ivoryDim }}>{description}</p>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} />
      <GoldButton icon={ImagePlus} className="w-full" disabled={status === "uploading"} onClick={() => fileRef.current?.click()}>
        {status === "uploading" ? "Uploading…" : previewFailed ? "Upload image" : "Replace image"}
      </GoldButton>
      {status === "done" && (
        <p className="text-[11.5px] mt-3 text-center" style={{ color: COLORS.gold }}>
          Updated.
        </p>
      )}
    </Card>
  );
}

function WelcomeNoteCard() {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("loading"); // loading | idle | saving | saved
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSiteContent("welcome_note")
      .then((value) => {
        setNote(value ?? "");
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
      await saveSiteContent("welcome_note", note.trim());
      setStatus("saved");
    } catch (e) {
      setError(e.message);
      setStatus("idle");
    }
  }

  return (
    <Card dark className="mb-4">
      <ErrorNote message={error} />
      <p className="text-[13px] mb-1" style={{ color: COLORS.ivory }}>Welcome Note</p>
      <p className="text-[11.5px] leading-relaxed mb-3" style={{ color: COLORS.ivoryDim }}>
        The note from the planning team on the guest home page, signed “The Planning Team”. Line breaks are kept.
      </p>
      <div className="mb-3">
        <Field label="Note" value={note} onChange={(v) => { setNote(v); setStatus("idle"); }} multiline />
      </div>
      <GoldButton className="w-full" disabled={status === "loading" || status === "saving" || !note.trim()} onClick={save}>
        {status === "saving" ? "Saving…" : "Save Note"}
      </GoldButton>
      {status === "saved" && (
        <p className="text-[11.5px] mt-3 text-center" style={{ color: COLORS.gold }}>
          Saved — live on the guest home page.
        </p>
      )}
    </Card>
  );
}
