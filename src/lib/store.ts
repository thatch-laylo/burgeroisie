import { BurgerData, Visit, Comment } from "./types";
import { DEFAULT_MEMBERS } from "./constants";
import * as fs from "fs/promises";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "burgeroisie.json");

function getDefaultData(): BurgerData {
  return {
    members: DEFAULT_MEMBERS,
    visits: [],
    version: 1,
  };
}

// --- Local filesystem storage (for next dev without netlify dev) ---

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

async function readLocal(): Promise<BurgerData> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BurgerData;
  } catch {
    const data = getDefaultData();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  }
}

async function writeLocal(data: BurgerData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- Netlify Blobs storage ---

async function readNetlify(): Promise<BurgerData> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: "burgeroisie-data", consistency: "strong" });
  const raw = await store.get("data", { type: "text" });
  if (!raw) {
    const data = getDefaultData();
    await store.set("data", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw) as BurgerData;
}

async function writeNetlify(data: BurgerData): Promise<void> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: "burgeroisie-data", consistency: "strong" });
  await store.set("data", JSON.stringify(data));
}

// --- Unified interface ---

const isNetlify =
  process.env.NETLIFY === "true" ||
  process.env.NETLIFY_DEV === "true" ||
  !!process.env.DEPLOY_URL;

async function getData(): Promise<BurgerData> {
  return isNetlify ? readNetlify() : readLocal();
}

async function setData(data: BurgerData): Promise<void> {
  return isNetlify ? writeNetlify(data) : writeLocal(data);
}

// --- Public API ---

export async function getVisits(): Promise<Visit[]> {
  const data = await getData();
  return data.visits;
}

export async function getVisitById(id: string): Promise<Visit | null> {
  const data = await getData();
  return data.visits.find((v) => v.id === id) ?? null;
}

export async function createVisit(
  input: Omit<Visit, "id" | "createdAt" | "updatedAt" | "comments" | "photoIds" | "averageScore">
): Promise<Visit> {
  const data = await getData();
  const now = new Date().toISOString();
  const averageScore =
    input.scores.length > 0
      ? Math.round(
          (input.scores.reduce((sum, s) => sum + s.score, 0) /
            input.scores.length) *
            10
        ) / 10
      : 0;

  const visit: Visit = {
    ...input,
    id: crypto.randomUUID(),
    averageScore,
    comments: [],
    photoIds: [],
    createdAt: now,
    updatedAt: now,
  };

  data.visits.push(visit);
  await setData(data);
  return visit;
}

export async function updateVisit(
  id: string,
  updates: Partial<Pick<Visit, "restaurantName" | "neighborhood" | "address" | "date" | "scores" | "burgerDescription" | "photoIds">>
): Promise<Visit | null> {
  const data = await getData();
  const idx = data.visits.findIndex((v) => v.id === id);
  if (idx === -1) return null;

  const visit = data.visits[idx];
  Object.assign(visit, updates, { updatedAt: new Date().toISOString() });

  if (updates.scores) {
    visit.averageScore =
      visit.scores.length > 0
        ? Math.round(
            (visit.scores.reduce((sum, s) => sum + s.score, 0) /
              visit.scores.length) *
              10
          ) / 10
        : 0;
  }

  data.visits[idx] = visit;
  await setData(data);
  return visit;
}

export async function addComment(
  visitId: string,
  memberId: string,
  text: string
): Promise<Comment | null> {
  const data = await getData();
  const visit = data.visits.find((v) => v.id === visitId);
  if (!visit) return null;

  const comment: Comment = {
    id: crypto.randomUUID(),
    memberId,
    text,
    createdAt: new Date().toISOString(),
  };

  visit.comments.push(comment);
  visit.updatedAt = new Date().toISOString();
  await setData(data);
  return comment;
}

export async function getMembers() {
  const data = await getData();
  return data.members;
}

export async function getAllData(): Promise<BurgerData> {
  return getData();
}

export async function setAllData(data: BurgerData): Promise<void> {
  return setData(data);
}
