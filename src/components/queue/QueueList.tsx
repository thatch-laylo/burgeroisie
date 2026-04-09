"use client";

import { useState, useEffect } from "react";
import { QueueItem, Member, Visit } from "@/lib/types";
import { QueueCard } from "./QueueCard";
import { useRouter } from "next/navigation";

export function QueueList({
  queue: initialQueue,
  members,
  visits,
}: {
  queue: QueueItem[];
  members: Member[];
  visits: Visit[];
}) {
  const router = useRouter();
  const [queue, setQueue] = useState(initialQueue);
  const [activeMemberId, setActiveMemberId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("burgeroisie-member") || members[0]?.id || "";
    }
    return members[0]?.id || "";
  });

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [hood, setHood] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeMemberId) {
      localStorage.setItem("burgeroisie-member", activeMemberId);
    }
  }, [activeMemberId]);

  const queued = [...queue]
    .filter((q) => q.status === "queued")
    .sort((a, b) => b.votes.length - a.votes.length || a.createdAt.localeCompare(b.createdAt));

  const visited = queue.filter((q) => q.status === "visited");

  async function handleSubmit() {
    if (!name.trim() || !hood.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: name.trim(),
          neighborhood: hood.trim(),
          reason: reason.trim(),
          suggestedBy: activeMemberId,
        }),
      });
      if (res.ok) {
        const item = await res.json();
        setQueue((prev) => [...prev, item]);
        setName("");
        setHood("");
        setReason("");
        setShowForm(false);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ? JSON.stringify(data.error) : "Failed to add");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(queueItemId: string) {
    // Optimistic update
    setQueue((prev) =>
      prev.map((q) => {
        if (q.id !== queueItemId) return q;
        const hasVoted = q.votes.includes(activeMemberId);
        return {
          ...q,
          votes: hasVoted
            ? q.votes.filter((v) => v !== activeMemberId)
            : [...q.votes, activeMemberId],
        };
      })
    );

    const res = await fetch("/api/queue/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queueItemId, memberId: activeMemberId }),
    });
    if (!res.ok) {
      // Rollback on error
      setQueue(initialQueue);
    }
  }

  async function handleMarkVisited(queueItemId: string) {
    const item = queue.find((q) => q.id === queueItemId);
    if (!item) return;

    // Redirect to new visit form pre-filled
    const params = new URLSearchParams({
      from: queueItemId,
      name: item.restaurantName,
      hood: item.neighborhood,
    });
    router.push(`/visits/new?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Member picker */}
      <div>
        <p className="text-xs text-text-muted mb-2">Who are you?</p>
        <div className="flex gap-2">
          {members.filter((m) => !m.isGuest).map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMemberId(m.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all ${
                activeMemberId === m.id
                  ? "bg-accent-gold/15 text-accent-gold ring-1 ring-accent-gold/30"
                  : "bg-white/5 text-text-muted hover:bg-white/10"
              }`}
            >
              <span>{m.emoji}</span>
              <span className="hidden sm:inline">{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add suggestion */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-lg border-2 border-dashed border-white/10 p-4 text-center text-text-muted transition-colors hover:border-accent-gold/30 hover:text-text-secondary"
        >
          + Suggest a Spot
        </button>
      ) : (
        <div className="rounded-xl border border-white/10 bg-bg-card p-4 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Restaurant name"
            autoFocus
            className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
          />
          <input
            type="text"
            value={hood}
            onChange={(e) => setHood(e.target.value)}
            placeholder="Neighborhood"
            className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
          />
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why? (Infatuation top 10, friend rec, walk-by...)"
            className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !name.trim() || !hood.trim()}
              className="flex-1 rounded-lg bg-accent-gold px-4 py-2 text-sm font-bold text-bg-primary transition-all hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add to Queue"}
            </button>
          </div>
        </div>
      )}

      {/* Queue items */}
      {queued.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <span className="text-4xl block mb-3">{"\u{1F914}"}</span>
          <p className="font-display text-lg">No suggestions yet</p>
          <p className="text-sm mt-1">Be the first to drop a spot.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {queued.map((item, i) => (
            <QueueCard
              key={item.id}
              item={item}
              members={members}
              activeMemberId={activeMemberId}
              isTop={i === 0}
              onVote={handleVote}
              onMarkVisited={handleMarkVisited}
            />
          ))}
        </div>
      )}

      {/* Been There */}
      {visited.length > 0 && (
        <details className="mt-8">
          <summary className="text-sm text-text-muted cursor-pointer hover:text-text-secondary">
            Been There ({visited.length})
          </summary>
          <div className="space-y-3 mt-3 opacity-60">
            {visited.map((item) => {
              const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));
              const suggestor = memberMap[item.suggestedBy];
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/5 bg-bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display font-bold text-text-primary">
                        {item.restaurantName}
                      </span>
                      <span className="text-text-muted text-sm ml-2">
                        {item.neighborhood}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {suggestor?.emoji} {item.votes.length} votes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
