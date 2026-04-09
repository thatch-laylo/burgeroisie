import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addQueueItem } from "@/lib/store";
import { addQueueItemSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = addQueueItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const item = await addQueueItem(parsed.data);
  revalidatePath("/queue");
  revalidatePath("/");
  return NextResponse.json(item, { status: 201 });
}
