import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Play } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { GoldButton, SectionTitle, LoadingNote, ErrorNote, Lightbox } from "../../shared/ui";
import { GALLERY_FILTERS } from "../data/staticContent";
import { useAuth } from "../../lib/auth";
import { fetchApprovedGallery, uploadGalleryPhoto } from "../../lib/queries";

export default function Gallery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [photos, setPhotos] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [open, setOpen] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchApprovedGallery(filter)
      .then(setPhotos)
      .catch((e) => setError(e.message));
  }, [filter]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    setError("");
    try {
      await uploadGalleryPhoto({ guestId: user.id, file, category: filter === "All" ? null : filter });
      setUploadMsg("Uploaded! It'll appear here once an organizer approves it.");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Shared Memories" title="Photo &amp; Memory Wall" light sub="Every upload is reviewed by the organizing team before it appears here." />
      <ErrorNote message={error} />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="shrink-0 rounded-full px-4 py-1.5 text-[11.5px] font-medium min-h-[36px]"
            style={{
              background: filter === f ? COLORS.gold : COLORS.card,
              color: filter === f ? COLORS.ink : COLORS.ivoryDim,
              border: filter === f ? "none" : "1px solid var(--line)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {user ? (
        <>
          <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
          <GoldButton icon={Upload} className="w-full mb-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload Photo or Video"}
          </GoldButton>
        </>
      ) : (
        <GoldButton icon={Upload} className="w-full mb-2" onClick={() => navigate("/login", { state: { from: "/gallery" } })}>
          Sign in to share a photo
        </GoldButton>
      )}
      {uploadMsg && <p className="text-[12px] mb-3" style={{ color: COLORS.gold }}>{uploadMsg}</p>}

      {!photos && !error && <LoadingNote label="Loading the gallery…" />}
      {photos && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {photos.length === 0 && (
            <p className="col-span-2 text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
              No approved photos in this category yet — be the first to share one.
            </p>
          )}
          {photos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpen(p)}
              aria-label={`View ${p.caption || (p.isVideo ? "guest video" : "guest photo")} full screen`}
              className="relative aspect-square rounded-[18px] overflow-hidden"
              style={{ border: "1px solid var(--line)", cursor: "zoom-in" }}
            >
              <GalleryThumb item={p} />
            </button>
          ))}
        </div>
      )}
      {open && (
        <Lightbox
          src={open.url}
          alt={open.caption || (open.isVideo ? "Guest video" : "Guest photo")}
          caption={open.caption}
          video={open.isVideo}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

// Square tile for a gallery upload. Videos show their first frame (the #t
// fragment makes iOS paint one) with a play badge.
function GalleryThumb({ item }) {
  if (!item.isVideo) {
    return <img src={item.url} alt={item.caption || "Guest upload"} className="w-full h-full object-cover" />;
  }
  return (
    <>
      <video src={`${item.url}#t=0.1`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
      <span
        className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center rounded-full"
        style={{ background: "rgba(10, 10, 10, 0.55)", color: "#F4F1EC" }}
        aria-hidden="true"
      >
        <Play size={16} strokeWidth={1.75} fill="currentColor" />
      </span>
    </>
  );
}
