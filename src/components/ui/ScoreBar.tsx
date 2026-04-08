"use client";

import { motion } from "motion/react";
import { SCORE_TIERS } from "@/lib/constants";

export function ScoreBar({
  score,
  delay = 0,
}: {
  score: number;
  delay?: number;
}) {
  const colorClass =
    score >= SCORE_TIERS.GOLD
      ? "from-amber-400 to-amber-300"
      : score >= SCORE_TIERS.GREEN
        ? "from-green-500 to-green-400"
        : score >= SCORE_TIERS.AMBER
          ? "from-amber-500 to-amber-400"
          : "from-red-500 to-red-400";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
      />
    </div>
  );
}
