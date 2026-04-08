"use client";

import { Visit } from "@/lib/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export function VisitCard({ visit }: { visit: Visit }) {
  return (
    <Link href={`/visits/${visit.id}`}>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-text-primary truncate">
              {visit.restaurantName}
            </h3>
            <p className="text-sm text-text-muted mt-0.5">
              {visit.neighborhood}
            </p>
            <p className="text-xs text-text-muted mt-1">{visit.date}</p>
            {visit.burgerDescription && (
              <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                {visit.burgerDescription}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
              <span>{visit.scores.length} scores</span>
              <span>&middot;</span>
              <span>{visit.comments.length} comments</span>
              {visit.photoIds.length > 0 && (
                <>
                  <span>&middot;</span>
                  <span>{visit.photoIds.length} photos</span>
                </>
              )}
            </div>
          </div>
          <ScoreBadge score={visit.averageScore} />
        </div>
      </Card>
    </Link>
  );
}
