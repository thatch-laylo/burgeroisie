import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getVisitById, updateVisit } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const visit = await getVisitById(id);
  if (!visit) {
    return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  }
  return NextResponse.json(visit);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const visit = await updateVisit(id, body);
  if (!visit) {
    return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  }
  revalidatePath(`/visits/${id}`);
  revalidatePath("/visits");
  revalidatePath("/scoreboard");
  return NextResponse.json(visit);
}
