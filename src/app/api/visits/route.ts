import { NextRequest, NextResponse } from "next/server";
import { createVisit } from "@/lib/store";
import { createVisitSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createVisitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { scores, ...rest } = parsed.data;
  const scoredMembers = scores.map((s) => ({
    ...s,
    totalScore: s.burgerScore + s.ambianceScore,
  }));

  const visit = await createVisit({ ...rest, scores: scoredMembers });
  return NextResponse.json(visit, { status: 201 });
}
