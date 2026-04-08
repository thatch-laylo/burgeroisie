import { getVisitById, getMembers } from "@/lib/store";
import { notFound } from "next/navigation";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Card } from "@/components/ui/Card";
import { CommentSection } from "@/components/comments/CommentSection";
import { PhotoSection } from "@/components/visits/PhotoSection";
import { formatMemberName } from "@/lib/constants";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [visit, members] = await Promise.all([getVisitById(id), getMembers()]);

  if (!visit) notFound();

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));
  const sortedScores = [...visit.scores].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/visits"
        className="text-sm text-text-muted hover:text-accent-gold transition-colors mb-6 inline-block"
      >
        &larr; All Visits
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {visit.restaurantName}
          </h1>
          <p className="text-text-secondary mt-1">
            {visit.neighborhood}
            {visit.address && ` \u00B7 ${visit.address}`}
          </p>
          <p className="text-text-muted text-sm mt-1">{visit.date}</p>
          {visit.burgerDescription && (
            <p className="text-text-secondary mt-3 italic">
              &ldquo;{visit.burgerDescription}&rdquo;
            </p>
          )}
        </div>
        <ScoreBadge score={visit.averageScore} size="lg" />
      </div>

      {/* Photos */}
      <Card hover={false} className="mb-8">
        <h2 className="font-display text-xl font-bold mb-4">
          Photos
        </h2>
        <PhotoSection
          visitId={visit.id}
          initialPhotoIds={visit.photoIds}
          members={members}
        />
      </Card>

      {/* Individual Scores */}
      <Card hover={false} className="mb-8">
        <h2 className="font-display text-xl font-bold mb-4">
          Individual Scores
        </h2>
        <div className="space-y-4">
          {sortedScores.map((score, i) => {
            const { name, emoji } = formatMemberName(score.memberId, memberMap);
            return (
              <div key={score.memberId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {emoji}
                    </span>
                    <span className="font-medium">
                      {name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-text-muted">
                      Burger: <span className="font-mono text-text-primary">{score.burgerScore}</span>
                    </span>
                    <span className="text-text-muted">
                      Vibe: <span className="font-mono text-text-primary">{score.ambianceScore}</span>
                    </span>
                    <ScoreBadge score={score.totalScore} size="sm" />
                  </div>
                </div>
                <ScoreBar score={score.totalScore} delay={i * 0.1} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Comments */}
      <Card hover={false}>
        <h2 className="font-display text-xl font-bold mb-4">
          Comments ({visit.comments.length})
        </h2>
        <CommentSection
          visitId={visit.id}
          comments={visit.comments}
          members={members}
        />
      </Card>
    </div>
  );
}
