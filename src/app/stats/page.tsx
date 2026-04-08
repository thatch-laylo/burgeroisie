import { getAllData } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { formatMemberName } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stats | Burgeroisie",
};

export default async function StatsPage() {
  const data = await getAllData();
  const { visits, members } = data;

  if (visits.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-8">&#x1F4CA; Stats</h1>
        <p className="text-text-muted">No data yet. Go eat some burgers!</p>
      </div>
    );
  }

  const sorted = [...visits].sort((a, b) => b.averageScore - a.averageScore);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const allScores = visits.flatMap((v) => v.scores);
  const highestIndividual = allScores.reduce(
    (max, s) => (s.totalScore > max.totalScore ? s : max),
    allScores[0]
  );
  const lowestIndividual = allScores.reduce(
    (min, s) => (s.totalScore < min.totalScore ? s : min),
    allScores[0]
  );

  const overallAvg =
    visits.reduce((sum, v) => sum + v.averageScore, 0) / visits.length;

  // Neighborhood breakdown
  const neighborhoods: Record<string, { count: number; totalScore: number }> =
    {};
  for (const v of visits) {
    if (!neighborhoods[v.neighborhood]) {
      neighborhoods[v.neighborhood] = { count: 0, totalScore: 0 };
    }
    neighborhoods[v.neighborhood].count++;
    neighborhoods[v.neighborhood].totalScore += v.averageScore;
  }
  const neighborhoodList = Object.entries(neighborhoods)
    .map(([name, { count, totalScore }]) => ({
      name,
      count,
      avg: totalScore / count,
    }))
    .sort((a, b) => b.avg - a.avg);

  // Most generous / harshest scorer
  const memberAvgs = members.map((m) => {
    const scores = allScores.filter((s) => s.memberId === m.id);
    const avg =
      scores.length > 0
        ? scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length
        : 0;
    return { member: m, avg, count: scores.length };
  }).filter((m) => m.count > 0);

  const mostGenerous = [...memberAvgs].sort((a, b) => b.avg - a.avg)[0];
  const harshest = [...memberAvgs].sort((a, b) => a.avg - b.avg)[0];

  const totalComments = visits.reduce((sum, v) => sum + v.comments.length, 0);

  const memberMap = Object.fromEntries(members.map((m) => [m.id, { name: m.name, emoji: m.emoji }]));

  // Find the visit that the highest/lowest individual score belongs to
  const highScoreVisit = visits.find((v) =>
    v.scores.some(
      (s) =>
        s.memberId === highestIndividual.memberId &&
        s.totalScore === highestIndividual.totalScore
    )
  );
  const lowScoreVisit = visits.find((v) =>
    v.scores.some(
      (s) =>
        s.memberId === lowestIndividual.memberId &&
        s.totalScore === lowestIndividual.totalScore
    )
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
        &#x1F4CA; Stats
      </h1>
      <p className="text-text-secondary mb-8">The numbers behind the buns.</p>

      {/* Big numbers */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
        <Card hover={false} className="text-center">
          <p className="text-3xl font-mono font-bold text-accent-gold">
            {visits.length}
          </p>
          <p className="text-xs text-text-muted mt-1">Burgers Reviewed</p>
        </Card>
        <Card hover={false} className="text-center">
          <p className="text-3xl font-mono font-bold text-accent-gold">
            {allScores.length}
          </p>
          <p className="text-xs text-text-muted mt-1">Individual Scores</p>
        </Card>
        <Card hover={false} className="text-center">
          <p className="text-3xl font-mono font-bold text-accent-gold">
            {overallAvg.toFixed(1)}
          </p>
          <p className="text-xs text-text-muted mt-1">Overall Average</p>
        </Card>
        <Card hover={false} className="text-center">
          <p className="text-3xl font-mono font-bold text-accent-gold">
            {totalComments}
          </p>
          <p className="text-xs text-text-muted mt-1">Hot Takes</p>
        </Card>
      </div>

      {/* Records */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card hover={false}>
          <h3 className="text-sm text-text-muted mb-3">
            &#x1F451; Highest Rated
          </h3>
          <p className="font-display text-xl font-bold">
            {best.restaurantName}
          </p>
          <p className="font-mono text-2xl font-bold text-amber-400 mt-1">
            {best.averageScore.toFixed(1)}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {best.neighborhood} &middot; {best.date}
          </p>
        </Card>
        <Card hover={false}>
          <h3 className="text-sm text-text-muted mb-3">
            &#x1F4A9; Lowest Rated
          </h3>
          <p className="font-display text-xl font-bold">
            {worst.restaurantName}
          </p>
          <p className="font-mono text-2xl font-bold text-red-500 mt-1">
            {worst.averageScore.toFixed(1)}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {worst.neighborhood} &middot; {worst.date}
          </p>
        </Card>
        <Card hover={false}>
          <h3 className="text-sm text-text-muted mb-3">
            &#x1F525; Highest Single Score
          </h3>
          <p className="font-display text-xl font-bold">
            {formatMemberName(highestIndividual.memberId, memberMap).name}
          </p>
          <p className="font-mono text-2xl font-bold text-amber-400 mt-1">
            {highestIndividual.totalScore}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {highScoreVisit ? `at ${highScoreVisit.restaurantName}` : ""}
          </p>
        </Card>
        <Card hover={false}>
          <h3 className="text-sm text-text-muted mb-3">
            &#x1F9CA; Lowest Single Score
          </h3>
          <p className="font-display text-xl font-bold">
            {formatMemberName(lowestIndividual.memberId, memberMap).name}
          </p>
          <p className="font-mono text-2xl font-bold text-red-500 mt-1">
            {lowestIndividual.totalScore}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {lowScoreVisit ? `at ${lowScoreVisit.restaurantName}` : ""}
          </p>
        </Card>
      </div>

      {/* Personality */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {mostGenerous && (
          <Card hover={false}>
            <h3 className="text-sm text-text-muted mb-3">
              &#x1F60D; Most Generous Scorer
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{mostGenerous.member.emoji}</span>
              <div>
                <p className="font-display font-bold">
                  {mostGenerous.member.name}
                </p>
                <p className="text-sm text-text-muted">
                  Avg: <span className="font-mono text-green-500">{mostGenerous.avg.toFixed(1)}</span>
                </p>
              </div>
            </div>
          </Card>
        )}
        {harshest && (
          <Card hover={false}>
            <h3 className="text-sm text-text-muted mb-3">
              &#x1F9D0; Harshest Critic
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{harshest.member.emoji}</span>
              <div>
                <p className="font-display font-bold">
                  {harshest.member.name}
                </p>
                <p className="text-sm text-text-muted">
                  Avg: <span className="font-mono text-red-500">{harshest.avg.toFixed(1)}</span>
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Neighborhoods */}
      <Card hover={false}>
        <h3 className="font-display text-xl font-bold mb-4">
          &#x1F5FD; By Neighborhood
        </h3>
        <div className="space-y-3">
          {neighborhoodList.map((n) => (
            <div key={n.name} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{n.name}</span>
                <span className="text-xs text-text-muted ml-2">
                  ({n.count} visit{n.count > 1 ? "s" : ""})
                </span>
              </div>
              <span className="font-mono font-bold text-accent-gold">
                {n.avg.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
