"use client";

import { useState } from "react";
import { Visit, Member } from "@/lib/types";
import { useRouter } from "next/navigation";

const EDIT_PASSWORD = "AMBIANCE";

export function EditVisit({
  visit,
  members,
}: {
  visit: Visit;
  members: Member[];
}) {
  const router = useRouter();
  const [stage, setStage] = useState<"closed" | "password" | "editing">("closed");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Edit form state
  const [restaurantName, setRestaurantName] = useState(visit.restaurantName);
  const [neighborhood, setNeighborhood] = useState(visit.neighborhood);
  const [address, setAddress] = useState(visit.address);
  const [date, setDate] = useState(visit.date);
  const [burgerDescription, setBurgerDescription] = useState(visit.burgerDescription);
  const [scores, setScores] = useState(visit.scores);
  const [submitting, setSubmitting] = useState(false);

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  function checkPassword() {
    if (password.toUpperCase() === EDIT_PASSWORD) {
      setStage("editing");
      setError("");
    } else {
      setError("Wrong password");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete this visit to ${visit.restaurantName}? This cannot be undone.`)) return;
    setSubmitting(true);
    const res = await fetch(`/api/visits/${visit.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/visits");
    } else {
      setError("Failed to delete");
      setSubmitting(false);
    }
  }

  async function handleSave() {
    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/visits/${visit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantName,
        neighborhood,
        address,
        date,
        burgerDescription,
        scores,
      }),
    });
    if (res.ok) {
      setStage("closed");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ? JSON.stringify(data.error) : "Failed to save");
    }
    setSubmitting(false);
  }

  if (stage === "closed") {
    return (
      <button
        onClick={() => setStage("password")}
        className="text-xs text-text-muted hover:text-accent-gold transition-colors"
      >
        {"\u270F\u{FE0F}"} Edit
      </button>
    );
  }

  if (stage === "password") {
    return (
      <div className="rounded-xl border border-white/10 bg-bg-card p-4 space-y-3">
        <p className="text-sm text-text-secondary">Password to edit:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkPassword()}
          autoFocus
          className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setStage("closed");
              setPassword("");
              setError("");
            }}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={checkPassword}
            className="flex-1 rounded-lg bg-accent-gold px-4 py-2 text-sm font-bold text-bg-primary hover:brightness-110"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-accent-gold/30 bg-bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Edit Visit</h3>
        <button
          onClick={() => setStage("closed")}
          className="text-text-muted hover:text-text-primary text-sm"
        >
          {"\u2715"}
        </button>
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">Restaurant</label>
        <input
          type="text"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-muted mb-1">Neighborhood</label>
          <input
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">What&apos;d you order?</label>
        <input
          type="text"
          value={burgerDescription}
          onChange={(e) => setBurgerDescription(e.target.value)}
          className="w-full rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-2">Scores</label>
        <div className="space-y-2">
          {scores.map((s, idx) => {
            const member = memberMap[s.memberId];
            return (
              <div key={s.memberId} className="flex items-center gap-3">
                <span className="text-sm w-24 truncate">
                  {member?.emoji || "\u{1F354}"} {member?.name || s.memberId}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.score}
                  onChange={(e) => {
                    const newScores = [...scores];
                    newScores[idx] = { ...s, score: Number(e.target.value) };
                    setScores(newScores);
                  }}
                  className="flex-1 accent-accent-gold"
                />
                <span className="font-mono text-sm w-10 text-right">{s.score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleDelete}
          disabled={submitting}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
        >
          Delete
        </button>
        <button
          onClick={() => setStage("closed")}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={submitting}
          className="flex-1 rounded-lg bg-accent-gold px-4 py-2 text-sm font-bold text-bg-primary hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
