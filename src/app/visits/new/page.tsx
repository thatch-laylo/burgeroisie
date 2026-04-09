import { getMembers } from "@/lib/store";
import { VisitForm } from "@/components/visits/VisitForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Visit | Burgeroisie",
};

export default async function NewVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; name?: string; hood?: string }>;
}) {
  const [members, params] = await Promise.all([getMembers(), searchParams]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
        &#x1F354; New Burger Review
      </h1>
      <p className="text-text-secondary mb-8">
        Where&apos;d you go? How was it? Rate it.
      </p>
      <VisitForm
        members={members}
        prefill={params.from ? {
          restaurantName: params.name || "",
          neighborhood: params.hood || "",
          fromQueueId: params.from,
        } : undefined}
      />
    </div>
  );
}
