"use client";

import { Visit } from "@/lib/types";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { motion } from "motion/react";
import Link from "next/link";

const PODIUM_CONFIG = [
  { position: 1, order: "order-2", height: "h-36", medal: "\u{1F451}", color: "from-amber-400/20 to-amber-400/5 border-amber-400/30", textColor: "text-amber-400", delay: 0.2 },
  { position: 2, order: "order-1", height: "h-28", medal: "\u{1F948}", color: "from-gray-300/20 to-gray-300/5 border-gray-300/30", textColor: "text-gray-300", delay: 0.4 },
  { position: 3, order: "order-3", height: "h-24", medal: "\u{1F949}", color: "from-amber-700/20 to-amber-700/5 border-amber-700/30", textColor: "text-amber-700", delay: 0.6 },
];

export function TopThreePodium({ visits }: { visits: Visit[] }) {
  const sorted = [...visits].sort((a, b) => b.averageScore - a.averageScore);
  const top3 = sorted.slice(0, 3);

  if (top3.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-3 px-4 pt-8 pb-4">
      {PODIUM_CONFIG.map((config) => {
        const visit = top3[config.position - 1];
        if (!visit) return null;

        return (
          <motion.div
            key={visit.id}
            className={`${config.order} flex-1 max-w-[200px]`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: config.delay, ease: "easeOut" }}
          >
            <Link href={`/visits/${visit.id}`} className="block">
              <div
                className={`flex flex-col items-center rounded-2xl border bg-gradient-to-b p-4 transition-all hover:scale-105 ${config.color}`}
              >
                <span className="text-3xl mb-2">{config.medal}</span>
                <h3 className="font-display text-sm font-bold text-center leading-tight min-h-[2.5rem]">
                  {visit.restaurantName}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {visit.neighborhood}
                </p>
                <div className={`mt-3 ${config.textColor}`}>
                  <AnimatedNumber
                    value={visit.averageScore}
                    className={`text-2xl ${config.position === 1 ? "score-glow" : ""}`}
                  />
                </div>
              </div>

              <div
                className={`${config.height} mt-2 rounded-b-xl bg-gradient-to-b ${config.color} border-x border-b opacity-50`}
              />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
