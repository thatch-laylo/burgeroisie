import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addComment } from "@/lib/store";
import { addCommentSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = addCommentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { visitId, memberId, text } = parsed.data;
  const comment = await addComment(visitId, memberId, text);

  if (!comment) {
    return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  }

  revalidatePath(`/visits/${visitId}`);
  return NextResponse.json(comment, { status: 201 });
}
