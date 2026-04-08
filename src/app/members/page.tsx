import { getAllData } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { ScoreBadge } from "@/components/ui/ScoreBadge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Crew | Burgeroisie",
};

export default async function MembersPage() {
  const data = await getAllData();
  const { members, visits } = data;

  const memberStats = members.map((member) => {
    const memberScores = visits.flatMap((v) =>
      v.scores.filter((s) => s.memberId === member.id)
    );
    const scores = memberScores.map((s) => s.score);
    const avg =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    const highest = scores.length > 0 ? Math.max(...scores) : 0;
    const lowest = scores.length > 0 ? Math.min(...scores) : 0;
    const reviewCount = scores.length;

    return { member, avg, highest, lowest, reviewCount };
  });

  const sorted = [...memberStats].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
        &#x1F465; The Crew
      </h1>
      <p className="text-text-secondary mb-8">
        Meet the burger connoisseurs.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map(({ member, avg, highest, lowest, reviewCount }) => (
          <Card key={member.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{member.emoji}</span>
              <div>
                <h3 className="font-display text-lg font-bold">
                  {member.name}
                </h3>
                <p className="text-xs text-text-muted">
                  {reviewCount} reviews
                  {member.isGuest && " \u00B7 Guest"}
                </p>
              </div>
            </div>

            {reviewCount > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-text-muted mb-1">Average</p>
                  <ScoreBadge score={avg} size="sm" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-muted mb-1">Highest</p>
                  <span className="font-mono font-bold text-green-500">
                    {highest}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-muted mb-1">Lowest</p>
                  <span className="font-mono font-bold text-red-500">
                    {lowest}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">No reviews yet</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
