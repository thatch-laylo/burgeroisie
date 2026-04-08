"use client";

import { useState } from "react";
import { Comment, Member } from "@/lib/types";

export function CommentSection({
  visitId,
  comments: initialComments,
  members,
}: {
  visitId: string;
  comments: Comment[];
  members: Member[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [memberId, setMemberId] = useState(members[0]?.id || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !memberId) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId, memberId, text: text.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setText("");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ? JSON.stringify(data.error) : `Failed (${res.status})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {comments.length === 0 && (
        <p className="text-text-muted text-sm mb-4">
          No comments yet. Be the first to drop a hot take.
        </p>
      )}

      <div className="space-y-3 mb-6">
        {comments.map((comment) => {
          const member = memberMap[comment.memberId];
          return (
            <div
              key={comment.id}
              className="rounded-lg bg-white/5 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">
                  {member?.emoji || "\u{1F354}"}
                </span>
                <span className="text-sm font-medium">
                  {member?.name || comment.memberId}
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{comment.text}</p>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.emoji} {m.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Drop your hot take..."
            className="flex-1 rounded-lg bg-bg-elevated border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-bold text-bg-primary transition-all hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
