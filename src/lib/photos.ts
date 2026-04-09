import * as fs from "fs/promises";
import * as path from "path";

const PHOTO_DIR = path.join(process.cwd(), "data", "photos");

function isNetlify(): boolean {
  return (
    process.env.NETLIFY === "true" ||
    process.env.NETLIFY_DEV === "true" ||
    !!process.env.DEPLOY_URL ||
    !!process.env.URL
  );
}

interface PhotoMeta {
  visitId: string;
  uploadedBy: string;
  caption: string;
  mimeType: string;
  uploadedAt: string;
}

// --- Local filesystem ---

async function ensurePhotoDir() {
  await fs.mkdir(PHOTO_DIR, { recursive: true });
}

async function uploadLocal(
  buffer: Buffer,
  meta: PhotoMeta
): Promise<string> {
  await ensurePhotoDir();
  const photoId = crypto.randomUUID();
  const ext = meta.mimeType.split("/")[1] || "jpg";
  await fs.writeFile(path.join(PHOTO_DIR, `${photoId}.${ext}`), buffer);
  await fs.writeFile(
    path.join(PHOTO_DIR, `${photoId}.meta.json`),
    JSON.stringify(meta)
  );
  return photoId;
}

async function getLocal(
  photoId: string
): Promise<{ buffer: Buffer; meta: PhotoMeta } | null> {
  await ensurePhotoDir();
  try {
    const metaRaw = await fs.readFile(
      path.join(PHOTO_DIR, `${photoId}.meta.json`),
      "utf-8"
    );
    const meta = JSON.parse(metaRaw) as PhotoMeta;
    const ext = meta.mimeType.split("/")[1] || "jpg";
    const buffer = await fs.readFile(path.join(PHOTO_DIR, `${photoId}.${ext}`));
    return { buffer, meta };
  } catch {
    return null;
  }
}

// --- Netlify Blobs ---

async function uploadNetlify(
  buffer: Buffer,
  meta: PhotoMeta
): Promise<string> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: "burgeroisie-photos", consistency: "strong" });
  const photoId = crypto.randomUUID();
  await store.set(`${photoId}.meta`, JSON.stringify(meta));
  await store.set(photoId, buffer.buffer as ArrayBuffer);
  return photoId;
}

async function getNetlify(
  photoId: string
): Promise<{ buffer: Buffer; meta: PhotoMeta } | null> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: "burgeroisie-photos", consistency: "strong" });
  const metaRaw = await store.get(`${photoId}.meta`, { type: "text" });
  if (!metaRaw) return null;
  const meta = JSON.parse(metaRaw) as PhotoMeta;
  try {
    const data = await store.get(photoId, { type: "arrayBuffer" });
    return { buffer: Buffer.from(data), meta };
  } catch {
    return null;
  }
}

// --- Public API ---

export async function uploadPhoto(
  file: File,
  visitId: string,
  uploadedBy: string,
  caption?: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const meta: PhotoMeta = {
    visitId,
    uploadedBy,
    caption: caption || "",
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };
  return isNetlify() ? uploadNetlify(buffer, meta) : uploadLocal(buffer, meta);
}

export async function getPhoto(
  photoId: string
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const result = isNetlify()
    ? await getNetlify(photoId)
    : await getLocal(photoId);
  if (!result) return null;
  return { buffer: result.buffer, mimeType: result.meta.mimeType };
}
