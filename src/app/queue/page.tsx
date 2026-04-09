import { getQueue, getMembers, getVisits } from "@/lib/store";
import { QueueList } from "@/components/queue/QueueList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Next Up | Burgeroisie",
};

export default async function QueuePage() {
  const [queue, members, visits] = await Promise.all([
    getQueue(),
    getMembers(),
    getVisits(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
        {"\u{1F5FA}\u{FE0F}"} Next Up
      </h1>
      <p className="text-text-secondary mb-8">
        Where should we go next Tuesday?
      </p>
      <QueueList queue={queue} members={members} visits={visits} />
    </div>
  );
}
