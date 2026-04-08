import { Member } from "./types";

// Core crew — update names when provided
export const DEFAULT_MEMBERS: Member[] = [
  { id: "thatch", name: "Thatch", emoji: "\u{1F354}", isGuest: false },
  { id: "ramin", name: "Ramin", emoji: "\u{1F525}", isGuest: false },
  { id: "jackie", name: "Jackie", emoji: "\u{1F451}", isGuest: false },
  { id: "timbo", name: "Timbo", emoji: "\u{1F3AF}", isGuest: false },
  { id: "skyler", name: "Skyler", emoji: "\u{26A1}", isGuest: false },
  { id: "vvp", name: "VVP", emoji: "\u{1F3B8}", isGuest: false },
];

export function formatMemberName(memberId: string, memberMap: Record<string, { name: string; emoji: string }>): { name: string; emoji: string } {
  if (memberMap[memberId]) {
    return { name: memberMap[memberId].name, emoji: memberMap[memberId].emoji };
  }
  // Guest IDs look like "guest-gabe" → "Gabe"
  if (memberId.startsWith("guest-")) {
    const raw = memberId.replace("guest-", "");
    return { name: raw.charAt(0).toUpperCase() + raw.slice(1), emoji: "\u{1F37B}" };
  }
  return { name: memberId, emoji: "\u{1F354}" };
}

export const SCORE_TIERS = {
  GREEN: 85,
  YELLOW: 70,
} as const;

export function getScoreColor(score: number): string {
  if (score >= SCORE_TIERS.GREEN) return "text-green-500";
  if (score >= SCORE_TIERS.YELLOW) return "text-amber-400";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= SCORE_TIERS.GREEN) return "bg-green-500";
  if (score >= SCORE_TIERS.YELLOW) return "bg-amber-400";
  return "bg-red-500";
}
