"use client";

import { Visit } from "@/lib/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { RankBadge } from "./RankBadge";
import { motion } from "motion/react";
import Link from "next/link";

export function ScoreboardTable({ visits }: { visits: Visit[] }) {
  const sorted = [...visits].sort((a, b) => b.averageScore - a.averageScore);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <span className="text-5xl mb-4">&#x1F354;</span>
        <p className="font-display text-lg">No burgers reviewed yet</p>
        <p className="text-sm">Time to hit the streets.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((visit, i) => (
        <motion.div
          key={visit.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
        >
          <Link href={`/visits/${visit.id}`}>
            <div className="group flex items-center gap-4 rounded-xl border border-white/5 bg-bg-card p-4 transition-all hover:border-accent-gold/20 hover:bg-bg-elevated">
              <RankBadge rank={i + 1} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-display font-bold truncate ${
                      i === 0 ? "shimmer-gold text-lg" : "text-text-primary"
                    }`}
                  >
                    {visit.restaurantName}
                  </h3>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  {visit.neighborhood} &middot; {visit.date} &middot;{" "}
                  {visit.scores.length} reviewers
                </p>
                <div className="mt-2">
                  <ScoreBar score={visit.averageScore} delay={i * 0.08 + 0.3} />
                </div>
              </div>

              <ScoreBadge score={visit.averageScore} />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
