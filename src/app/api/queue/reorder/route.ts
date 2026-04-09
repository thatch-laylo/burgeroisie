import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { reorderQueue } from "@/lib/store";

export async function POST(request: NextRequest) {
  const { orderedIds } = await request.json();
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "orderedIds array required" }, { status: 400 });
  }

  await reorderQueue(orderedIds);
  revalidatePath("/queue");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
