import { getVisits } from "@/lib/store";
import { TopThreePodium } from "@/components/scoreboard/TopThreePodium";
import { VisitCard } from "@/components/visits/VisitCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const visits = await getVisits();
  const sorted = [...visits].sort((a, b) => b.averageScore - a.averageScore);
  const recent = [...visits]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
          <span className="shimmer-gold">Burgeroisie</span>
        </h1>
        <p className="text-text-secondary text-lg mt-4 max-w-md mx-auto">
          NYC&apos;s most elite burger review crew. Every Tuesday, a new contender.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className="font-mono text-3xl font-bold text-accent-gold">
            {visits.length}
          </span>
          <span className="text-text-muted text-sm">burgers reviewed</span>
          <span className="text-text-muted">&middot;</span>
          <span className="font-mono text-3xl font-bold text-accent-gold">
            {new Set(visits.flatMap((v) => v.scores.map((s) => s.memberId))).size}
          </span>
          <span className="text-text-muted text-sm">reviewers</span>
        </div>
      </section>

      {/* Top 3 Podium */}
      {sorted.length >= 3 && (
        <section className="mb-12">
          <TopThreePodium visits={sorted} />
        </section>
      )}

      {/* Recent Visits */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Recent Visits</h2>
          <Link
            href="/visits"
            className="text-sm text-accent-gold hover:underline"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16">
        <Link
          href="/scoreboard"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-gold px-8 py-4 font-display text-lg font-bold text-bg-primary transition-all hover:brightness-110 hover:scale-105"
        >
          &#x1F3C6; View Full Scoreboard
        </Link>
      </section>
    </div>
  );
}
