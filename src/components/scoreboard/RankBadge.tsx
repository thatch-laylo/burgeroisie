"use client";

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-lg" title="1st Place">
        &#x1F451;
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300/20 text-lg" title="2nd Place">
        &#x1F948;
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700/20 text-lg" title="3rd Place">
        &#x1F949;
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 font-mono text-sm text-text-muted">
      {rank}
    </span>
  );
}
