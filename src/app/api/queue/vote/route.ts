import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { toggleQueueVote } from "@/lib/store";
import { voteQueueItemSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = voteQueueItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { queueItemId, memberId } = parsed.data;
  const item = await toggleQueueVote(queueItemId, memberId);

  if (!item) {
    return NextResponse.json({ error: "Queue item not found" }, { status: 404 });
  }

  revalidatePath("/queue");
  revalidatePath("/");
  return NextResponse.json(item);
}
