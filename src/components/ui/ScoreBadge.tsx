"use client";

import { SCORE_TIERS } from "@/lib/constants";

export function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const isGold = score >= SCORE_TIERS.GOLD;
  const isGreen = score >= SCORE_TIERS.GREEN;
  const isAmber = score >= SCORE_TIERS.AMBER;

  const colorClass = isGold
    ? "bg-amber-400/15 text-amber-400 ring-amber-400/30"
    : isGreen
      ? "bg-green-500/15 text-green-500 ring-green-500/30"
      : isAmber
        ? "bg-amber-500/15 text-amber-500 ring-amber-500/30"
        : "bg-red-500/15 text-red-500 ring-red-500/30";

  const sizeClass =
    size === "lg"
      ? "px-4 py-2 text-2xl"
      : size === "md"
        ? "px-3 py-1 text-base"
        : "px-2 py-0.5 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-lg font-mono font-bold ring-1 ${colorClass} ${sizeClass} ${isGold ? "score-glow" : ""}`}
    >
      {score.toFixed(1)}
    </span>
  );
}
