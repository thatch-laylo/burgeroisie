import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { removeQueueItem } from "@/lib/store";

export async function POST(request: NextRequest) {
  const { queueItemId } = await request.json();
  if (!queueItemId) {
    return NextResponse.json({ error: "queueItemId required" }, { status: 400 });
  }

  const removed = await removeQueueItem(queueItemId);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  revalidatePath("/queue");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
