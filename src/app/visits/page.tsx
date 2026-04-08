import { getVisits } from "@/lib/store";
import { VisitCard } from "@/components/visits/VisitCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Visits | Burgeroisie",
};

export default async function VisitsPage() {
  const visits = await getVisits();
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
        &#x1F4CB; All Visits
      </h1>
      <p className="text-text-secondary mb-8">
        {visits.length} burgers and counting.
      </p>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <span className="text-5xl block mb-4">&#x1F354;</span>
          <p className="font-display text-lg">No visits yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}
    </div>
  );
}
