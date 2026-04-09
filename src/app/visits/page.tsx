import { getVisits } from "@/lib/store";
import { VisitList } from "@/components/visits/VisitList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Visits | Burgeroisie",
};

export default async function VisitsPage() {
  const visits = await getVisits();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
        &#x1F4CB; All Visits
      </h1>
      <p className="text-text-secondary mb-8">
        {visits.length} burgers and counting.
      </p>
      <VisitList visits={visits} />
    </div>
  );
}
