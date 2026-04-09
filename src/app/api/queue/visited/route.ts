import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { markQueueVisited } from "@/lib/store";
import { markVisitedSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = markVisitedSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { queueItemId, visitId } = parsed.data;
  const item = await markQueueVisited(queueItemId, visitId);

  if (!item) {
    return NextResponse.json({ error: "Queue item not found" }, { status: 404 });
  }

  revalidatePath("/queue");
  revalidatePath("/");
  return NextResponse.json(item);
}
