"use client";

import { useState, useEffect } from "react";
import { Member } from "@/lib/types";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

interface ScoreEntry {
  memberId: string;
  score: number;
  active: boolean;
}

export function VisitForm({
  members,
  prefill,
}: {
  members: Member[];
  prefill?: { restaurantName: string; neighborhood: string; fromQueueId: string };
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Restaurant info
  const [restaurantName, setRestaurantName] = useState(prefill?.restaurantName || "");
  const [neighborhood, setNeighborhood] = useState(prefill?.neighborhood || "");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [burgerDescription, setBurgerDescription] = useState("");

  // Step 2: Scores
  const [scores, setScores] = useState<ScoreEntry[]>(
    members.map((m) => ({
      memberId: m.id,
      score: 75,
      active: true,
    }))
  );

  // Guest handling
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState<{ id: string; name: string }[]>([]);

  function addGuest() {
    if (!guestName.trim()) return;
    const id = `guest-${Date.now()}`;
    setGuests((prev) => [...prev, { id, name: guestName.trim() }]);
    setScores((prev) => [
      ...prev,
      { memberId: id, score: 75, active: true },
    ]);
    setGuestName("");
  }

  function updateScore(memberId: string, value: number) {
    setScores((prev) =>
      prev.map((s) => (s.memberId === memberId ? { ...s, score: value } : s))
    );
  }

  function toggleMember(memberId: string) {
    setScores((prev) =>
      prev.map((s) =>
        s.memberId === memberId ? { ...s, active: !s.active } : s
      )
    );
  }

  const activeScores = scores.filter((s) => s.active);
  const avgScore =
    activeScores.length > 0
      ? activeScores.reduce((sum, s) => sum + s.score, 0) /
        activeScores.length
      : 0;

  // Confetti effect for high scores
  useEffect(() => {
    if (step === 3 && avgScore >= 85) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4A843", "#F59E0B", "#F5E6B8"],
      });
    }
  }, [step, avgScore]);

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName,
          neighborhood,
          address,
          date,
          burgerDescription,
          scores: activeScores.map((s) => ({
            memberId: s.memberId,
            score: s.score,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ? JSON.stringify(data.error) : "Failed to save");
        return;
      }

      const visit = await res.json();

      // If this visit came from the queue, mark the queue item as visited
      if (prefill?.fromQueueId) {
        await fetch("/api/queue/visited", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            queueItemId: prefill.fromQueueId,
            visitId: visit.id,
          }),
        });
      }

      router.push(`/visits/${visit.id}`);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const allMembers = [
    ...members.map((m) => ({ id: m.id, name: m.name, emoji: m.emoji })),
    ...guests.map((g) => ({ id: g.id, name: g.name, emoji: "\u{1F37B}" })),
  ];

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold transition-colors ${
                step >= s
                  ? "bg-accent-gold text-bg-primary"
                  : "bg-white/5 text-text-muted"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-0.5 w-8 rounded transition-colors ${
                  step > s ? "bg-accent-gold" : "bg-white/5"
                }`}
              />
            )}
          </div>
        ))}
        <span className="ml-3 text-sm text-text-muted">
          {step === 1 ? "Restaurant Info" : step === 2 ? "Scores" : "Review"}
        </span>
      </div>

      {/* Step 1: Restaurant Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="e.g. J.G. Melon"
              className="w-full rounded-lg bg-bg-elevated border border-white/10 px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Neighborhood *
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="e.g. Upper East Side"
              className="w-full rounded-lg bg-bg-elevated border border-white/10 px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 1291 Third Ave, New York, NY"
              className="w-full rounded-lg bg-bg-elevated border border-white/10 px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg bg-bg-elevated border border-white/10 px-4 py-3 text-text-primary focus:border-accent-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              What&apos;d you order?
            </label>
            <input
              type="text"
              value={burgerDescription}
              onChange={(e) => setBurgerDescription(e.target.value)}
              placeholder="e.g. Double smash burger with cheddar, special sauce"
              className="w-full rounded-lg bg-bg-elevated border border-white/10 px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!restaurantName.trim() || !neighborhood.trim()}
            className="w-full rounded-lg bg-accent-gold px-6 py-3 font-display font-bold text-bg-primary transition-all hover:brightness-110 disabled:opacity-50 mt-4"
          >
            Next: Add Scores &rarr;
          </button>
        </div>
      )}

      {/* Step 2: Scores */}
      {step === 2 && (
        <div className="space-y-6">
          <p className="text-sm text-text-muted">
            Toggle members who were present, then set their scores.
          </p>

          {allMembers.map((member) => {
            const scoreEntry = scores.find((s) => s.memberId === member.id);
            if (!scoreEntry) return null;

            return (
              <div
                key={member.id}
                className={`rounded-xl border p-4 transition-all ${
                  scoreEntry.active
                    ? "border-white/10 bg-bg-card"
                    : "border-white/5 bg-bg-card/50 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => toggleMember(member.id)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`h-5 w-5 rounded border-2 transition-colors ${
                        scoreEntry.active
                          ? "border-accent-gold bg-accent-gold"
                          : "border-white/20"
                      }`}
                    >
                      {scoreEntry.active && (
                        <svg
                          className="h-full w-full text-bg-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg">{member.emoji}</span>
                    <span className="font-medium">{member.name}</span>
                  </button>
                  {scoreEntry.active && (
                    <span className="font-mono text-lg font-bold text-accent-gold">
                      {scoreEntry.score}
                    </span>
                  )}
                </div>

                {scoreEntry.active && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted">
                        Score
                      </span>
                      <span className="font-mono text-text-primary">
                        {scoreEntry.score}/100
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={scoreEntry.score}
                      onChange={(e) =>
                        updateScore(member.id, Number(e.target.value))
                      }
                      className="w-full accent-accent-gold"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Add guest */}
          <div className="flex gap-2">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGuest()}
              placeholder="Add a guest reviewer..."
              className="flex-1 rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
            />
            <button
              onClick={addGuest}
              disabled={!guestName.trim()}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-white/15 disabled:opacity-50"
            >
              + Guest
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep(1)}
              className="rounded-lg border border-white/10 px-6 py-3 font-medium text-text-secondary transition-colors hover:bg-white/5"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={activeScores.length === 0}
              className="flex-1 rounded-lg bg-accent-gold px-6 py-3 font-display font-bold text-bg-primary transition-all hover:brightness-110 disabled:opacity-50"
            >
              Review &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent-gold/20 bg-bg-card p-6 text-center">
            <h2 className="font-display text-2xl font-bold mb-1">
              {restaurantName}
            </h2>
            <p className="text-text-muted text-sm">
              {neighborhood} &middot; {date}
            </p>
            <div
              className={`mt-4 font-mono text-5xl font-bold ${
                avgScore >= 85 ? "text-amber-400 score-glow" : "text-accent-gold"
              }`}
            >
              {avgScore.toFixed(1)}
            </div>
            <p className="text-text-muted text-sm mt-1">
              Average from {activeScores.length} reviewers
            </p>
          </div>

          <div className="space-y-2">
            {activeScores.map((s) => {
              const member = allMembers.find((m) => m.id === s.memberId);
              return (
                <div
                  key={s.memberId}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2"
                >
                  <span className="text-sm">
                    {member?.emoji} {member?.name}
                  </span>
                  <span className="font-mono font-bold">{s.score}</span>
                </div>
              );
            })}
          </div>

          {error && (
            <p className="text-accent-red text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep(2)}
              className="rounded-lg border border-white/10 px-6 py-3 font-medium text-text-secondary transition-colors hover:bg-white/5"
            >
              &larr; Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-lg bg-accent-gold px-6 py-3 font-display font-bold text-bg-primary transition-all hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Submit Review \u{1F354}"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
