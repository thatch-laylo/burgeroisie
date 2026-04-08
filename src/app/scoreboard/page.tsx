import { getVisits } from "@/lib/store";
import { ScoreboardTable } from "@/components/scoreboard/ScoreboardTable";
import { TopThreePodium } from "@/components/scoreboard/TopThreePodium";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scoreboard | Burgeroisie",
};

export default async function ScoreboardPage() {
  const visits = await getVisits();
  const sorted = [...visits].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
        &#x1F3C6; The Scoreboard
      </h1>
      <p className="text-text-secondary mb-8">
        Every burger ranked, from best to worst. No mercy.
      </p>

      {sorted.length >= 3 && (
        <div className="mb-10">
          <TopThreePodium visits={sorted} />
        </div>
      )}

      <ScoreboardTable visits={visits} />
    </div>
  );
}
