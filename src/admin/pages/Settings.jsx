import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, GoldButton, ErrorNote } from "../../shared/ui";
import { supabase } from "../../lib/supabaseClient";

const BRANDING_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/branding`;

// The manifest, index.html, and service worker all reference these exact
// paths, so uploading here updates the installed app's icon everywhere.
const SIZES = [
  { path: "app-icon-512.png", px: 512 },
  { path: "app-icon-192.png", px: 192 },
  { path: "apple-touch-icon.png", px: 180 },
];

function renderIcon(img, px) {
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0B0B0C";
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

export default function Settings() {
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
      const img = await createImageBitmap(file);
      for (const { path, px } of SIZES) {
        const blob = await renderIcon(img, px);
        const { error: upErr } = await supabase.storage
          .from("branding")
          .upload(path, blob, { upsert: true, contentType: "image/png", cacheControl: "3600" });
        if (upErr) throw upErr;
      }
      setStatus("done");
      setPreviewFailed(false);
      setVersion(Date.now());
    } catch (err) {
      setStatus("idle");
      setError(err.message || "Upload failed.");
    }
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Configure"
        title="Settings"
        light
        sub="The app icon appears when guests save the site to their home screen, and on announcement notifications."
      />
      <ErrorNote message={error} />

      <Card dark className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,166,103,0.3)" }}
          >
            {previewFailed ? (
              <span className="text-[10px] text-center px-2" style={{ color: COLORS.ivoryDim }}>
                No icon yet
              </span>
            ) : (
              <img
                src={`${BRANDING_BASE}/app-icon-192.png?v=${version}`}
                alt="Current app icon"
                className="w-full h-full object-cover"
                onError={() => setPreviewFailed(true)}
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] mb-1" style={{ color: COLORS.ivory }}>App Icon</p>
            <p className="text-[11.5px] leading-relaxed" style={{ color: COLORS.ivoryDim }}>
              Upload a square image, at least 512×512. It's resized automatically for every device.
              Guests who already saved the app will see the new icon after re-adding it.
            </p>
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} />
        <GoldButton icon={ImagePlus} className="w-full" disabled={status === "uploading"} onClick={() => fileRef.current?.click()}>
          {status === "uploading" ? "Uploading…" : previewFailed ? "Upload icon" : "Replace icon"}
        </GoldButton>
        {status === "done" && (
          <p className="text-[11.5px] mt-3 text-center" style={{ color: COLORS.gold }}>
            Icon updated.
          </p>
        )}
      </Card>
    </div>
  );
}
