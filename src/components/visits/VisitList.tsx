"use client";

import { useState } from "react";
import { Visit } from "@/lib/types";
import { VisitCard } from "./VisitCard";

export function VisitList({ visits }: { visits: Visit[] }) {
  const [activeHood, setActiveHood] = useState<string | null>(null);

  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));

  const neighborhoods = [
    ...new Set(visits.map((v) => v.neighborhood).filter(Boolean)),
  ].sort();

  const filtered = activeHood
    ? sorted.filter((v) => v.neighborhood === activeHood)
    : sorted;

  return (
    <div>
      {/* Neighborhood filter */}
      {neighborhoods.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveHood(null)}
            className={`rounded-full px-3 py-1 text-xs transition-all ${
              !activeHood
                ? "bg-accent-gold/15 text-accent-gold ring-1 ring-accent-gold/30"
                : "bg-white/5 text-text-muted hover:bg-white/10"
            }`}
          >
            All ({visits.length})
          </button>
          {neighborhoods.map((hood) => {
            const count = visits.filter((v) => v.neighborhood === hood).length;
            return (
              <button
                key={hood}
                onClick={() =>
                  setActiveHood(activeHood === hood ? null : hood)
                }
                className={`rounded-full px-3 py-1 text-xs transition-all ${
                  activeHood === hood
                    ? "bg-accent-gold/15 text-accent-gold ring-1 ring-accent-gold/30"
                    : "bg-white/5 text-text-muted hover:bg-white/10"
                }`}
              >
                {hood} ({count})
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <span className="text-5xl block mb-4">{"\u{1F354}"}</span>
          <p className="font-display text-lg">No visits yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}
    </div>
  );
}
