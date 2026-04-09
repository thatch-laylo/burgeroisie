"use client";

import { QueueItem, Member } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function QueueCard({
  item,
  members,
  activeMemberId,
  isTop,
  onVote,
  onMarkVisited,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  item: QueueItem;
  members: Member[];
  activeMemberId: string;
  isTop: boolean;
  onVote: (queueItemId: string) => void;
  onMarkVisited: (queueItemId: string) => void;
  onRemove: (queueItemId: string) => void;
  onMoveUp: (queueItemId: string) => void;
  onMoveDown: (queueItemId: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));
  const hasVoted = item.votes.includes(activeMemberId);
  const suggestor = memberMap[item.suggestedBy];

  return (
    <Card
      hover={false}
      className={isTop ? "border-accent-gold/30 shadow-lg shadow-accent-gold/5" : ""}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-text-primary truncate">
            {item.restaurantName}
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            {item.neighborhood}
          </p>
          {item.reason && (
            <p className="text-sm text-text-secondary mt-1 italic">
              &ldquo;{item.reason}&rdquo;
            </p>
          )}
          <p className="text-xs text-text-muted mt-2">
            Suggested by {suggestor?.emoji || "\u{1F354}"} {suggestor?.name || item.suggestedBy}
          </p>
        </div>
        <button
          onClick={() => onVote(item.id)}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${
            hasVoted
              ? "bg-accent-gold/15 text-accent-gold"
              : "bg-white/5 text-text-muted hover:bg-white/10"
          }`}
        >
          <span className="text-lg">{hasVoted ? "\u{1F44D}" : "\u{1F44D}"}</span>
          <span className="font-mono text-sm font-bold">{item.votes.length}</span>
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          {item.votes.map((voterId) => {
            const voter = memberMap[voterId];
            return (
              <span key={voterId} className="text-sm" title={voter?.name || voterId}>
                {voter?.emoji || "\u{1F354}"}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onMoveUp(item.id)}
              disabled={!canMoveUp}
              className="text-xs text-text-muted hover:text-text-primary transition-colors disabled:opacity-20"
              title="Move up"
            >
              {"\u25B2"}
            </button>
            <button
              onClick={() => onMoveDown(item.id)}
              disabled={!canMoveDown}
              className="text-xs text-text-muted hover:text-text-primary transition-colors disabled:opacity-20"
              title="Move down"
            >
              {"\u25BC"}
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-text-muted hover:text-red-400 transition-colors"
          >
            Remove
          </button>
          <button
            onClick={() => onMarkVisited(item.id)}
            className="text-xs text-text-muted hover:text-accent-gold transition-colors"
          >
            We went! &rarr;
          </button>
        </div>
      </div>
    </Card>
  );
}
