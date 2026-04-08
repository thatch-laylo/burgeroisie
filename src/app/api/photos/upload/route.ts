import { NextRequest, NextResponse } from "next/server";
import { uploadPhoto } from "@/lib/photos";
import { getVisitById, updateVisit } from "@/lib/store";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const visitId = formData.get("visitId") as string | null;
  const uploadedBy = formData.get("uploadedBy") as string | null;
  const caption = (formData.get("caption") as string) || "";

  if (!file || !visitId || !uploadedBy) {
    return NextResponse.json(
      { error: "file, visitId, and uploadedBy are required" },
      { status: 400 }
    );
  }

  const visit = await getVisitById(visitId);
  if (!visit) {
    return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  }

  const photoId = await uploadPhoto(file, visitId, uploadedBy, caption);
  await updateVisit(visitId, { photoIds: [...visit.photoIds, photoId] });

  return NextResponse.json({ photoId }, { status: 201 });
}
