"use client";

import { useState, useRef } from "react";
import { Member } from "@/lib/types";

export function PhotoUpload({
  visitId,
  members,
  onUploaded,
}: {
  visitId: string;
  members: Member[];
  onUploaded: (photoId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [memberId, setMemberId] = useState(members[0]?.id || "");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function resizeImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob!], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality
        );
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    const resized = await resizeImage(f);
    setFile(resized);
    setPreview(URL.createObjectURL(resized));
  }

  function clearSelection() {
    setFile(null);
    setPreview(null);
    setCaption("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("visitId", visitId);
      formData.append("uploadedBy", memberId);
      formData.append("caption", caption);

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { photoId } = await res.json();
        onUploaded(photoId);
        clearSelection();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || `Upload failed (${res.status})`);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {!preview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-lg border-2 border-dashed border-white/10 p-6 text-center text-text-muted transition-colors hover:border-accent-gold/30 hover:text-text-secondary"
        >
          <span className="block text-2xl mb-1">{"\u{1F4F8}"}</span>
          <span className="text-sm">Tap to add a burger pic</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-lg"
            />
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-sm text-white hover:bg-black/80"
            >
              {"\u2715"}
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.emoji} {m.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="flex-1 rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full rounded-lg bg-accent-gold px-4 py-2 text-sm font-bold text-bg-primary transition-all hover:brightness-110 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
